FROM golang:1.20 as builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o main /app/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN chmod +x /app/main

CMD ["/app/main"]

EXPOSE 8080
