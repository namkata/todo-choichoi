package models

import (
	"time"
)

/*
Class-level comment: Todo is the core DB model for tasks, stored in Postgres via GORM.
It includes a deadline and tracks completion. Fields map directly to API schema.
*/

type Todo struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"` // Inline: UUID primary key
	Title     string    `gorm:"type:varchar(255);not null" json:"title"`                  // Inline: short title
	Note      *string   `gorm:"type:text" json:"note"`                                   // Inline: optional note
	DueAt     *time.Time `json:"dueAt"`                                                   // Inline: optional deadline
	Status    string    `gorm:"type:varchar(20);not null;default:'pending'" json:"status"` // Inline: pending|completed
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}