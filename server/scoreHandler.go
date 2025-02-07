package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func ScoreHandler(w http.ResponseWriter, r *http.Request) {
	var player *Player
	var err error

	if r.Method != http.MethodPost {
		log.Println("Method not allowed")
		return
	}

	if err = json.NewDecoder(r.Body).Decode(&player); err != nil {
		log.Println("Error decode body :", err)
		return
	}

	if err := score(player); err != nil {
		fmt.Println("Error store score in db", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
