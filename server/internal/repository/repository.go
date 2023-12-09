package repository

import (
	"database/sql"
	"server/internal/models"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
}
