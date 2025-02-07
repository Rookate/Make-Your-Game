package server

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var Db *sql.DB

func init() {
	var err error

	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		Db, err = sql.Open("sqlite3", "./spaceInvaders.db")
		if err == nil {
			err = Db.Ping()
			if err == nil {
				break
			}
		}
		log.Printf("Tentative de connexion à la base de données échouée (%d/%d). Nouvelle tentative dans 5 secondes...", i+1, maxRetries)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatalf("Impossible de se connecter à la base de données après %d tentatives : %v", maxRetries, err)
	}
	createTables()

	log.Println("Connexion à la base de données réussie")
}

func createTables() {
	statement := `CREATE TABLE IF NOT EXISTS players (
		username VARCHAR(55),
		score INTERGER,
		date VARCHAR(55)
	);`

	_, err := Db.Exec(statement)
	if err != nil {
		log.Fatalf("error creating table : %v", err)
	}
}
