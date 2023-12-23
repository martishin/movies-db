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
	port          = 8080
	readTimeout   = 5 * time.Second
	writeTimeout  = 10 * time.Second
	idleTimeout   = 15 * time.Second
	tokenExpiry   = 15 * time.Minute
	refreshExpiry = 24 * time.Hour
)

type application struct {
	dsn          string
	domain       string
	db           repository.DatabaseRepo
	auth         auth
	jwtSecret    string
	jwtIssuer    string
	jwtAudience  string
	cookieDomain string
	apiKey       string
}

func main() {
	// set application config
	var app application

	// read from command line
	flag.StringVar(&app.dsn, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies "+
		"sslmode=disable timezone=UTC connect_timeout=5", "Postgres connection string")
	flag.StringVar(&app.jwtSecret, "jwt-secret", "verysecret", "signing secret")
	flag.StringVar(&app.jwtIssuer, "jwt-issuer", "example.com", "signing issuer")
	flag.StringVar(&app.jwtAudience, "jwt-audience", "example.com", "signing audience")
	flag.StringVar(&app.cookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.domain, "domain", "example.com", "domain")
	flag.StringVar(&app.apiKey, "api-key", "9d8c7dab38148cf3b8760dbc71a77deb", "api key")
	flag.Parse()

	// connect to database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.db = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.db.Connection().Close()

	app.auth = auth{
		issuer:        app.jwtIssuer,
		audience:      app.jwtAudience,
		secret:        app.jwtSecret,
		tokenExpiry:   tokenExpiry,
		refreshExpiry: refreshExpiry,
		cookiePath:    "/",
		cookieName:    "__Host-refresh_token",
		cookieDomain:  app.cookieDomain,
	}

	// start web server
	log.Println(app.domain)
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
