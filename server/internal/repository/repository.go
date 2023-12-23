package repository

import (
	"database/sql"
	"server/internal/models"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id int) (*models.User, error)

	AllMovies() ([]*models.Movie, error)
	OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error)
	OneMovie(id int) (*models.Movie, error)
	InsertMovie(movie models.Movie) (int, error)

	AllGenres() ([]*models.Genre, error)
	UpdateMovieGenres(id int, genreIDs []int) error
	UpdateMovie(movie models.Movie) error
}
