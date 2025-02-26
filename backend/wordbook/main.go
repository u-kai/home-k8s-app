package main

import (
	"context"
	"ele/common"
	wordbook "ele/wordbook/pkg"
	"log"
	"log/slog"
	"net/http"
	"os"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
	"go.opentelemetry.io/otel/trace"
)

var tracer trace.Tracer

// OpenTelemetry の初期化
func initTracer() func() {
	// OTLP/HTTP エクスポータを作成
	exporter, err := otlptracehttp.New(context.Background(),
		otlptracehttp.WithEndpoint(os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")),
		otlptracehttp.WithInsecure(), // HTTP の場合は TLS 無効化
	)
	if err != nil {
		log.Fatalf("Failed to create OTLP exporter: %v", err)
	}

	// トレースプロバイダーの作成
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceNameKey.String("wordbook"),
		)),
	)

	otel.SetTracerProvider(tp)
	tracer = tp.Tracer("db-tracer")

	return func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Fatalf("Failed to shutdown tracer provider: %v", err)
		}
	}
}

func main() {
	logger := common.NewJsonLogger()
	ctx := context.Background()
	traceShutdown := initTracer()
	defer traceShutdown()
	server := common.DefaultELEServer("wordbook")
	server.RegisterHandler("/words", func(w http.ResponseWriter, r *http.Request) {
		ctx := otel.GetTextMapPropagator().Extract(r.Context(), propagation.HeaderCarrier(r.Header))
		slog.InfoContext(ctx, "ctx", slog.Any("ctx", ctx), "headers", slog.Any("headers", r.Header))
		ctx, span := tracer.Start(ctx, "Handle Request")
		defer span.End()
		wordbook.FetchWordProfileHandler(ctx, tracer)(w, r)
	})
	server.RegisterHandler("/deleteWord", wordbook.DeleteWordHandler(ctx, tracer))
	server.RegisterHandler("/registerWord", wordbook.RegisterWordHandler(ctx))
	server.RegisterHandler("/updateWord", wordbook.UpdateWordHandler(ctx, tracer))
	logger.Info("Starting Wordbook server...")
	server.Start()
}
