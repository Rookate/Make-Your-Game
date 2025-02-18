package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

type StructScore struct {
	CurrentIndex int `json:"currentIndex"`
}

func GetScoreHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		log.Println("Error: Method not allowed")
		return
	}

	// Récupérer currentIndex depuis les paramètres de l'URL
	queryValues := r.URL.Query()
	indexStr := queryValues.Get("currentIndex")

	if indexStr == "" {
		http.Error(w, "Missing 'currentIndex' query parameter", http.StatusBadRequest)
		log.Println("Error: Missing 'currentIndex' query parameter")
		return
	}

	// Convertir en entier
	currentIndex, err := strconv.Atoi(indexStr)
	if err != nil {
		http.Error(w, "Invalid 'currentIndex' parameter", http.StatusBadRequest)
		log.Println("Error: Invalid 'currentIndex' parameter")
		return
	}

	players, err := getScore(StructScore{CurrentIndex: currentIndex})
	if err != nil {
		http.Error(w, fmt.Sprintf("Error getting score: %v", err), http.StatusInternalServerError)
		log.Printf("Error getting score: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(players); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding score struct: %v", err), http.StatusInternalServerError)
		log.Printf("Error encoding score struct: %v", err)
		return
	}
}
