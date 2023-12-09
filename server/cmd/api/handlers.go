package main

import (
	"encoding/json"
	"log"
	"net/http"
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

	out, err := json.Marshal(payload)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(out)
	if err != nil {
		log.Println(err)
	}
}

func (app *application) allMovies(w http.ResponseWriter, _ *http.Request) {
	movies, err := app.DB.AllMovies()
	if err != nil {
		log.Println(err)
		return
	}

	out, err := json.Marshal(movies)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(out)
	if err != nil {
		log.Println(err)
	}
}
