package main

import (
	"fmt"
	"net/http"
)

func (app *application) home(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprintf(w, "Hello, world from %s!", app.Domain)
}
