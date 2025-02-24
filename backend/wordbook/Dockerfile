FROM --platform=$BUILDPLATFORM golang:1.22 as builder

WORKDIR /app

COPY . .

ARG TARGETOS TARGETARCH

RUN GOOS=$TARGETOS GOARCH=$TARGETARCH CGO_ENABLED=0 go build -ldflags="-s -w" -o main ./wordbook/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x /app/main

CMD ["/app/main"]

EXPOSE 8080
