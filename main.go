package main

import (
	"log"
	"net/http"
	"portfolio/internal/logging"
)

func main() {
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", logging.LoggingMiddleware(fs))

	log.Println("Server started on :80")
	err := http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal(err)
	}
}
