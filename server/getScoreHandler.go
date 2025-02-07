package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func GetScoreHandler(w http.ResponseWriter, r *http.Request) {

	// Vérifier si la méthode HTTP est bien GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		log.Println("Error: Method not allowed")
		return
	}

	// Récupérer les scores depuis la base de données
	players, err := getScore()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error getting score: %v", err), http.StatusInternalServerError)
		log.Printf("Error getting score: %v", err)
		return
	}

	// Encoder les scores au format JSON et les envoyer dans la réponse
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(players); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding score struct: %v", err), http.StatusInternalServerError)
		log.Printf("Error encoding score struct: %v", err)
		return
	}
}
