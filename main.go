package main

import (
	"log"
	"net/http"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./css"))))
	http.Handle("/", http.FileServer(http.Dir("./")))

	log.Println("Server started on http://localhost:8081")
	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		log.Fatalf("failed to start server : %v", err)
	}
}
