# Build stage
FROM golang:1.25.6-alpine AS BUILD

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o golang-portfolio .

# Runtime stage
FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=BUILD /app/golang-portfolio /app/golang-portfolio

USER 65532:65532

EXPOSE 80

CMD ["/app/golang-portfolio"]