package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"todo-choichoi/internal/models"
)

/*
Class-level comment: TodoHandler provides CRUD endpoints for todos.
It depends on a *gorm.DB and includes Swagger/OpenAPI annotations per method.
*/

type TodoHandler struct {
	DB *gorm.DB // Inline: GORM database handle
}

// Function-level comment: Register routes under /api/todos
func (h *TodoHandler) Register(r *gin.Engine) {
	grp := r.Group("/api/todos")
	grp.POST("", h.Create)
	grp.GET("", h.List)
	grp.PUT(":id", h.Update)
	grp.DELETE(":id", h.Delete)
	grp.PATCH(":id/complete", h.ToggleComplete)
}

// Create godoc
// @Summary      Create todo
// @Description  Create a new todo item with optional note and deadline
// @Tags         todos
// @Accept       json
// @Produce      json
// @Param        payload  body  models.Todo  true  "Todo payload"
// @Success      200  {object}  models.Todo
// @Failure      400  {string}  string
// @Router       /api/todos [post]
func (h *TodoHandler) Create(c *gin.Context) {
	var in models.Todo
	if err := c.ShouldBindJSON(&in); err != nil {
		c.String(http.StatusBadRequest, "invalid payload")
		return
	}
	// Inline: sanitize defaults
	if in.Status == "" {
		in.Status = "pending"
	}
	if in.DueAt != nil {
		// Inline: normalize to UTC
		utc := in.DueAt.UTC()
		in.DueAt = &utc
	}
	if err := h.DB.Create(&in).Error; err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, in)
}

// List godoc
// @Summary      List todos
// @Description  Retrieve all todos ordered by created time desc
// @Tags         todos
// @Produce      json
// @Success      200  {array}  models.Todo
// @Router       /api/todos [get]
func (h *TodoHandler) List(c *gin.Context) {
	var items []models.Todo
	if err := h.DB.Order("created_at desc").Find(&items).Error; err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, items)
}

// Update godoc
// @Summary      Update todo
// @Description  Update a todo item by id
// @Tags         todos
// @Accept       json
// @Produce      json
// @Param        id   path  string  true  "Todo ID"
// @Param        payload  body  models.Todo  true  "Todo payload"
// @Success      200  {object}  models.Todo
// @Router       /api/todos/{id} [put]
func (h *TodoHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var in models.Todo
	if err := c.ShouldBindJSON(&in); err != nil {
		c.String(http.StatusBadRequest, "invalid payload")
		return
	}
	var existing models.Todo
	if err := h.DB.First(&existing, "id = ?", id).Error; err != nil {
		c.String(http.StatusBadRequest, "not found")
		return
	}
	existing.Title = in.Title
	existing.Note = in.Note
	existing.Status = in.Status
	if in.DueAt != nil {
		utc := in.DueAt.UTC()
		existing.DueAt = &utc
	}
	if err := h.DB.Save(&existing).Error; err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, existing)
}

// Delete godoc
// @Summary      Delete todo
// @Description  Delete a todo item by id
// @Tags         todos
// @Param        id   path  string  true  "Todo ID"
// @Success      200  {string}  string
// @Router       /api/todos/{id} [delete]
func (h *TodoHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.DB.Delete(&models.Todo{}, "id = ?", id).Error; err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.String(http.StatusOK, "ok")
}

// ToggleComplete godoc
// @Summary      Toggle complete
// @Description  Mark a todo completed or pending
// @Tags         todos
// @Accept       json
// @Produce      json
// @Param        id   path  string  true  "Todo ID"
// @Param        payload  body  models.TogglePayload  true  "Toggle payload"
// @Success      200  {object}  models.Todo
// @Router       /api/todos/{id}/complete [patch]
func (h *TodoHandler) ToggleComplete(c *gin.Context) {
	id := c.Param("id")
	var payload struct {
		Completed bool `json:"completed"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.String(http.StatusBadRequest, "invalid payload")
		return
	}
	var existing models.Todo
	if err := h.DB.First(&existing, "id = ?", id).Error; err != nil {
		c.String(http.StatusBadRequest, "not found")
		return
	}
	existing.Status = map[bool]string{true: "completed", false: "pending"}[payload.Completed]
	if payload.Completed {
		// Inline: if completed, clear overdue semantics by bounding DueAt to now
		now := time.Now().UTC()
		existing.UpdatedAt = now
	}
	if err := h.DB.Save(&existing).Error; err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, existing)
}