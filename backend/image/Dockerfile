FROM golang:1.22 as builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -o main ./image/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x /app/main

CMD ["/app/main"]

EXPOSE 8080
