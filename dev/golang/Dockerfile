# goのバージョン
FROM golang:1.23.4-alpine

WORKDIR /golang

COPY . .

RUN go build .

CMD ["go", "run", "."]
