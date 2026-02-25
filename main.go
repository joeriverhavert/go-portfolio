package main

import (
	"log"
	"net/http"
)

func main() {
	// Serve static files from the "public" directory
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	log.Println("Server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
