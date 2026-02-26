package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"portfolio/internal/logging"
)

func main() {
	logFile, err := os.OpenFile("access.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}
	defer logFile.Close()

	multiWriter := io.MultiWriter(os.Stdout, logFile)
	logging.SetOutput(multiWriter)

	// Serve static files from the "public" directory
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", logging.LoggingMiddleware(fs))

	log.Println("Server started on :80")
	err = http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal(err)
	}
}
