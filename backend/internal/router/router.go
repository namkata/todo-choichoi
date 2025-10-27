package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"todo-choichoi/internal/handlers"
)

/*
Class-level comment: Package router wires Gin routes and Swagger UI.
*/

// Function-level comment: Build a gin.Engine with all routes registered.
func Build(h *handlers.TodoHandler) *gin.Engine {
	r := gin.Default() // Inline: includes logger and recovery
	
	// Inline: CORS middleware for development
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}
	r.Use(cors.New(config))

	// Inline: register todo routes
	h.Register(r)

	// Inline: swagger UI mounted at /swagger/index.html
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return r
}