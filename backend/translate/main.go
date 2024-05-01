package main

import (
	"context"
	"log/slog"

	"ele/common"
	"ele/translate/pkg"
)

func main() {
	logger := common.NewJsonLogger()
	slog.SetDefault(logger)

	server := common.DefaultELEServer("translate")
	ctx := context.Background()
	server.RegisterHandler("/", pkg.TranslateHandler(ctx))
	server.RegisterHandler("/sentence", pkg.TranslateSentenceStreamHandler(ctx))
	server.RegisterHandler("/sentence/review", pkg.ReviewSentenceStreamHandler(ctx))
	server.RegisterHandler("/sentence/generate", pkg.GenerateSentenceHandler(ctx))

	slog.Info("Starting Translate server...")
	server.Start()
}
