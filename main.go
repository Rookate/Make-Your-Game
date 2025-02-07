package main

import (
	"log"
	"net/http"
	"spaceInvader/server"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./css"))))
	http.Handle("/", http.FileServer(http.Dir("./")))
	http.HandleFunc("/api/postScore", server.ScoreHandler)
	http.HandleFunc("/api/getScore", server.GetScoreHandler)

	log.Println("Server started on http://localhost:8081")
	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		log.Fatalf("failed to start server : %v", err)
	}
}
