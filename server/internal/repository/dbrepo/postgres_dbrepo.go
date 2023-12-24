package dbrepo

import (
	"context"
	"database/sql"
	"errors"
	"server/internal/models"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) AllMovies(genre ...int) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var rows *sql.Rows
	var err error

	if len(genre) > 0 {
		query := `
			SELECT
				id,
				title,
				release_date,
				runtime,
				mpaa_rating,
				description,
				COALESCE(image, ''),
				created_at,
				updated_at
			FROM
				public.movies
			WHERE
				id IN (SELECT movie_id FROM public.movies_genres WHERE genre_id = $1)
			ORDER BY
				title
		`
		rows, err = m.DB.QueryContext(ctx, query, genre[0])
	} else {
		query := `
			SELECT
				id,
				title,
				release_date,
				runtime,
				mpaa_rating,
				description,
				COALESCE(image, ''),
				created_at,
				updated_at
			FROM
				public.movies
			ORDER BY
				title
		`
		rows, err = m.DB.QueryContext(ctx, query)
	}

	if err != nil {
		return nil, err
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err = rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT
			id,
			title,
			release_date,
			runtime,
			mpaa_rating,
			description,
			COALESCE(image, ''),
			created_at,
			updated_at
		FROM
			public.movies
		WHERE 
		    id = $1
	`

	row := m.DB.QueryRowContext(ctx, query, id)
	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	// get genres, if any
	query = `
		SELECT
			g.id,
			g.genre
		FROM
			public.movies_genres mg
			LEFT JOIN public.genres g ON mg.genre_id = g.id
		WHERE
			mg.movie_id = $1
		ORDER BY
			g.genre
    `

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err = rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	movie.Genres = genres

	return &movie, nil
}

//nolint:funlen // don't want to split for now
func (m *PostgresDBRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT
			id,
			title,
			release_date,
			runtime,
			mpaa_rating,
			description,
			COALESCE(image, ''),
			created_at,
			updated_at
		FROM
			public.movies
		WHERE 
		    id = $1
	`

	row := m.DB.QueryRowContext(ctx, query, id)
	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)

	if err != nil {
		return nil, nil, err
	}

	// get genres, if any
	query = `
		SELECT
			g.id,
			g.genre
		FROM
			public.movies_genres mg
			LEFT JOIN public.genres g ON mg.genre_id = g.id
		WHERE
			mg.movie_id = $1
		ORDER BY
			g.genre
    `

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, nil, err
	}
	if err = rows.Err(); err != nil {
		return nil, nil, err
	}

	defer rows.Close()

	var genres []*models.Genre

	var genresArray []int
	for rows.Next() {
		var g models.Genre
		err = rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}

		genres = append(genres, &g)
		genresArray = append(genresArray, g.ID)
	}

	movie.Genres = genres
	movie.GenresArray = genresArray

	var allGenres []*models.Genre

	query = `
		SELECT 
		    id, 
		    genre
		FROM public.genres
		ORDER BY genre
	`
	rows, err = m.DB.QueryContext(ctx, query)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, nil, err
	}
	if err = rows.Err(); err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var g models.Genre
		err = rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}

		allGenres = append(allGenres, &g)
	}

	return &movie, allGenres, nil
}

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT
			id,
			email,
			first_name,
			last_name,
			password,
			created_at,
			updated_at
		FROM
			public.users
		WHERE
			email = $1
	`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT
			id,
			email,
			first_name,
			last_name,
			password,
			created_at,
			updated_at
		FROM
			public.users
		WHERE
			id = $1
	`
	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		SELECT  
		    id,
		    genre,
		    created_at,
		    updated_at
		FROM 
		    public.genres
		ORDER BY 
		    genre
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var g models.Genre
		err = rows.Scan(
			&g.ID,
			&g.Genre,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	return genres, nil
}

func (m *PostgresDBRepo) InsertMovie(movie models.Movie) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `
		INSERT
		INTO
			public.movies
			(title, release_date, runtime, mpaa_rating, description, image, created_at,
			 updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	var newID int
	//nolint:execinquery // We need to fetch id
	err := m.DB.QueryRowContext(ctx, stmt,
		movie.Title,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Description,
		movie.Image,
		movie.CreatedAt,
		movie.UpdatedAt,
	).Scan(&newID)
	if err != nil {
		return 0, err
	}

	return newID, nil
}

func (m *PostgresDBRepo) UpdateMovieGenres(id int, genreIDs []int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := m.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	stmt := `
		DELETE
		FROM
			public.movies_genres
		WHERE
			movie_id = $1
	`

	_, err = tx.ExecContext(ctx, stmt, id)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	for _, n := range genreIDs {
		stmt = `
			INSERT
			INTO
				public.movies_genres
				(movie_id, genre_id)
			VALUES
				($1, $2)
    	`
		_, err = tx.ExecContext(ctx, stmt, id, n)
		if err != nil {
			_ = tx.Rollback()
			return err
		}
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) UpdateMovie(movie models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `
		UPDATE
			public.movies
		SET
			title        = $1,
			release_date = $2,
			runtime      = $3,
			mpaa_rating  = $4,
			description  = $5,
			image        = $6,
			updated_at   = $7
		WHERE
			id = $8
	`

	_, err := m.DB.ExecContext(ctx, stmt,
		movie.Title,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Description,
		movie.Image,
		movie.UpdatedAt,
		movie.ID,
	)
	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) DeleteMovie(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `
		DELETE
		FROM
			public.movies
		WHERE
			id = $1
	`

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	return nil
}
