package main

import (
	"net/http"

	"github.com/go-chi/chi/v5/middleware"

	"github.com/go-chi/chi/v5"
)

func (app *application) routes() http.Handler {
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.enableCORS)

	mux.Get("/", app.home)

	mux.Get("/authenticate", app.authenticate)

	mux.Get("/movies", app.allMovies)

	return mux
}
