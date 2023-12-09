package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"server/internal/repository"
	"server/internal/repository/dbrepo"
	"time"
)

const (
	port         = 8080
	readTimeout  = 5 * time.Second
	writeTimeout = 10 * time.Second
	idleTimeout  = 15 * time.Second
)

type application struct {
	DSN    string
	Domain string
	DB     repository.DatabaseRepo
}

func main() {
	// set application config
	var app application

	// read from command line
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies "+
		"sslmode=disable timezone=UTC connect_timeout=5", "Postgres connection string")
	flag.Parse()

	// connect to database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	// start web server
	app.Domain = "example.com"
	log.Println(app.Domain)
	log.Println("Starting application on port", port)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		ReadTimeout:  readTimeout,
		WriteTimeout: writeTimeout,
		IdleTimeout:  idleTimeout,
		Handler:      app.routes(),
	}

	err = srv.ListenAndServe()
	if err != nil {
		log.Println(err)
		return
	}
}
