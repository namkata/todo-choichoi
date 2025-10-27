package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	_ "todo-choichoi/docs"
	"todo-choichoi/internal/db"
	"todo-choichoi/internal/handlers"
	"todo-choichoi/internal/models"
	"todo-choichoi/internal/router"
)

/*
Class-level comment: Entry-point for the HTTP server. It sets up DB, auto-migrates
schema, registers routes, and starts Gin on the configured port.

OpenAPI/Swagger comments (top-level):
@title          Todo Choichoi API
@version        1.0
@description    REST API cho ứng dụng Todo (tạo ghi chú, thời hạn, theo dõi quá hạn)
@host           localhost:8080
@BasePath       /
@schemes        http
*/

// UPPER_SNAKE_CASE constant: default server port
const DEFAULT_PORT = "8080"

// Function-level comment: Bootstrap the service
func Bootstrap() (*gin.Engine, *gorm.DB) {
	gdb, err := db.OpenGorm()
	if err != nil {
		log.Fatalf("cannot open database: %v", err)
	}
	// Inline: ensure pgcrypto extension for gen_random_uuid()
	if err := gdb.Exec(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`).Error; err != nil {
		log.Printf("warn: cannot enable pgcrypto: %v", err)
	}
	// Inline: auto-migrate schema
	if err := gdb.AutoMigrate(&models.Todo{}); err != nil {
		log.Fatalf("auto-migrate failed: %v", err)
	}

	h := &handlers.TodoHandler{DB: gdb}
	r := router.Build(h)
	return r, gdb
}

// Function-level comment: main starts the HTTP server
func main() {
	r, _ := Bootstrap()
	port := os.Getenv("PORT")
	if port == "" { port = DEFAULT_PORT }
	log.Printf("Server listening on :%s", port)
	if err := r.Run(":"+port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}