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

	mux.Post("/authenticate", app.authenticate)
	mux.Get("/refresh", app.refreshToken)
	mux.Get("/logout", app.logout)

	mux.Get("/movies", app.allMovies)
	mux.Get("/movies/{id}", app.GetMovie)

	mux.Get("/genres", app.AllGenres)

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.authRequired)

		mux.Get("/movies", app.movieCatalog)
		mux.Get("/movies/{id}", app.MovieForEdit)
	})

	return mux
}
