FROM golang:1.21 as builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -o main ./translate/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x /app/main

CMD ["/app/main"]

EXPOSE 8080
