FROM golang:1.20 as builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main /app/main.go

FROM alpine:3.12

WORKDIR /app

COPY --from=builder /app/main .

CMD ["ls","/app/main"]

EXPOSE 8080
