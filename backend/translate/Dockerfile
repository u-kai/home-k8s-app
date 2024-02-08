FROM golang:1.20

# 1
ENV ROOT=/go/src/app

WORKDIR ${ROOT}

# 3
COPY go.mod go.sum ./

# 4
RUN go mod download

COPY . .

RUN go build -o /bin/app ./main.go

FROM alpine:3.12

COPY --from=0 /bin/app /bin/app

EXPOSE 8080

# 6
CMD ["/bin/app"]
