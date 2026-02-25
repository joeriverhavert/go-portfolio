FROM golang:1.25.6-alpine

WORKDIR /app

COPY go.mod go.sum /app/
RUN go mod download

COPY public /app/public
COPY main.go /app/main.go

RUN CGO_ENABLED=0 GOOS=linux go build -o golang-portfolio .

EXPOSE 80

CMD ["./golang-portfolio"]