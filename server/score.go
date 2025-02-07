package server

import (
	"fmt"
	"log"
)

type Player struct {
	Name  string `json:"username"`
	Score int    `json:"score"`
	Date  string `json:"date"`
}

func score(player *Player) error {
	stmt, err := Db.Prepare("INSERT INTO players(username, score, date) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(player.Name, player.Score, player.Date)
	if err != nil {
		log.Fatal(err)
	}
	return nil
}

func getScore() ([]Player, error) {
	// Prépare la requête
	stmt, err := Db.Prepare("SELECT username, score, date FROM players")
	if err != nil {
		return nil, fmt.Errorf("error preparing query: %v", err)
	}
	defer stmt.Close()

	// Exécute la requête et récupère les résultats
	rows, err := stmt.Query() // Utilise Query ici pour récupérer plusieurs lignes
	if err != nil {
		return nil, fmt.Errorf("error executing db query: %v", err)
	}
	defer rows.Close()

	// Crée une slice pour stocker les joueurs
	var players []Player

	// Parcourt les lignes de résultats
	for rows.Next() {
		var player Player
		err := rows.Scan(&player.Name, &player.Score, &player.Date)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		players = append(players, player)
	}

	// Vérifie s'il y a eu une erreur pendant le parcours des lignes
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %v", err)
	}

	return players, nil
}
