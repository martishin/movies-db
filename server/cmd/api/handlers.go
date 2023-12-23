package main

import (
	"errors"
	"net/http"
	"server/internal/models"
	"strconv"

	"github.com/go-chi/chi/v5"

	"github.com/golang-jwt/jwt/v5"
)

func (app *application) home(w http.ResponseWriter, _ *http.Request) {
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go Movies up and running",
		Version: "1.0.0",
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) allMovies(w http.ResponseWriter, _ *http.Request) {
	movies, err := app.db.AllMovies()
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) authenticate(w http.ResponseWriter, r *http.Request) {
	// read json payload
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &requestPayload)
	if err != nil {
		_ = app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	// validate user against database
	user, err := app.db.GetUserByEmail(requestPayload.Email)
	if err != nil {
		_ = app.errorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		_ = app.errorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// create a jwt user
	u := jwtUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	// generate tokens
	tokens, err := app.auth.generateTokenPair(&u)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	refreshCookie := app.auth.getRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	// _, _ = w.Write([]byte(tokens.Token))
	_ = app.writeJSON(w, http.StatusAccepted, tokens)
}

func (app *application) refreshToken(w http.ResponseWriter, r *http.Request) {
	for _, cookie := range r.Cookies() {
		if cookie.Name == app.auth.cookieName {
			claims := &claims{}
			refreshToken := cookie.Value

			// parse the token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.jwtSecret), nil
			})
			if err != nil {
				_ = app.errorJSON(w, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get the user id from the token claims
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				_ = app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			user, err := app.db.GetUserByID(userID)
			if err != nil {
				_ = app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			u := jwtUser{
				ID:        user.ID,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			}

			tokenPairs, err := app.auth.generateTokenPair(&u)
			if err != nil {
				_ = app.errorJSON(w, errors.New("error generating tokens"), http.StatusUnauthorized)
				return
			}

			http.SetCookie(w, app.auth.getRefreshCookie(tokenPairs.RefreshToken))

			_ = app.writeJSON(w, http.StatusOK, tokenPairs)
		}
	}
}

func (app *application) logout(w http.ResponseWriter, _ *http.Request) {
	http.SetCookie(w, app.auth.getExpiredRefreshCookie())
	w.WriteHeader(http.StatusAccepted)
}

func (app *application) movieCatalog(w http.ResponseWriter, _ *http.Request) {
	movies, err := app.db.AllMovies()
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) GetMovie(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	movieID, err := strconv.Atoi(id)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	movie, err := app.db.OneMovie(movieID)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}
	_ = app.writeJSON(w, http.StatusOK, movie)
}

func (app *application) MovieForEdit(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	movieID, err := strconv.Atoi(id)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	movie, genres, err := app.db.OneMovieForEdit(movieID)
	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	var payload = struct {
		Movie  *models.Movie   `json:"movie"`
		Genres []*models.Genre `json:"genres"`
	}{
		movie,
		genres,
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllGenres(w http.ResponseWriter, _ *http.Request) {
	genres, err := app.db.AllGenres()

	if err != nil {
		_ = app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, genres)
}
