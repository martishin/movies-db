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

	mux.Route("/api", func(apiRouter chi.Router) {
		apiRouter.Post("/graph", app.moviesGraphQL)

		apiRouter.Post("/signup", app.signup)
		apiRouter.Post("/authenticate", app.authenticate)
		apiRouter.Get("/refresh", app.refreshToken)
		apiRouter.Get("/logout", app.logout)

		apiRouter.Get("/movies", app.allMovies)
		apiRouter.Get("/movies/{id}", app.getMovie)

		apiRouter.Get("/genres", app.allGenres)
		apiRouter.Get("/movies/genres/{id}", app.allMoviesByGenre)

		// Sub-router for admin routes
		apiRouter.Route("/admin", func(adminRouter chi.Router) {
			adminRouter.Use(app.authRequired)

			adminRouter.Get("/movies", app.allMovies)
			adminRouter.Get("/movies/{id}", app.movieForEdit)
			adminRouter.Post("/movies/0", app.insertMovie)
			adminRouter.Patch("/movies/{id}", app.updateMovie)
			adminRouter.Delete("/movies/{id}", app.DeleteMovie)
		})
	})

	return mux
}
