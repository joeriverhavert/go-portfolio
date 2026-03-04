package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"portfolio/internal/logging"
)

//go:embed public/*
var publicFS embed.FS

func main() {
	fsys, err := fs.Sub(publicFS, "public")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.FS(fsys))
	http.Handle("/", logging.LoggingMiddleware(fs))

	log.Println("Server started on :80")
	err = http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal(err)
	}
}
