package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

/*
Class-level comment: Package db encapsulates GORM initialization for Postgres.
It reads env vars to build DSN. This keeps main clean and testable.
*/

// UPPER_SNAKE_CASE constant: default DSN format
const DEFAULT_POSTGRES_DSN = "host=localhost user=postgres password=postgres dbname=todo port=5432 sslmode=disable" // Inline: dev default

// Function-level comment: Open a GORM *DB using env vars.
func OpenGorm() (*gorm.DB, error) {
	dsn := os.Getenv("POSTGRES_DSN")
	if dsn == "" {
		dsn = DEFAULT_POSTGRES_DSN
		log.Printf("POSTGRES_DSN not set, using default: %s", dsn)
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}
	return db, nil
}