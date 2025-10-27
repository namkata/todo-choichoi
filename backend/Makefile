# Class-level comment: Convenience targets for dev workflow

.PHONY: dev docs db

# Function-level comment: Generate Swagger docs
docs:
	swag init -g cmd/server/main.go -o docs

# Function-level comment: Run local DB via docker compose
db:
	docker compose up -d

# Function-level comment: Run server with env from .env.example if .env missing
dev:
	[ -f .env ] || cp .env.example .env
	go run ./cmd/server