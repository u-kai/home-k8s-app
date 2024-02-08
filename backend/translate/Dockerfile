FROM golang:1.20

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main /app/main.go

FROM alpine:3.12

WORKDIR /app

COPY --from=0 /app/main .


EXPOSE 8080

CMD ["/app/main"]
