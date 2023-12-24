package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func testHandler(w http.ResponseWriter, r *http.Request) {}

var testAuth = auth{
	issuer:        "testIssuer",
	audience:      "testAudience",
	secret:        "testSecret",
	tokenExpiry:   15 * time.Minute,
	refreshExpiry: 24 * time.Hour,
	cookiePath:    "/",
	cookieName:    "testCookie",
}

func TestEnableCORS(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	app := &application{auth: testAuth}
	handler := app.enableCORS(http.HandlerFunc(testHandler))

	handler.ServeHTTP(rr, req)

	headers := rr.Header()

	if headers.Get("Access-Control-Allow-Origin") != "http://locahost:5173" {
		t.Errorf("Expected Access-Control-Allow-Origin header to be set")
	}
}

func TestAuthRequired(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	user := jwtUser{ID: 1, FirstName: "John", LastName: "Doe"}
	tokenPairs, err := testAuth.generateTokenPair(&user)
	if err != nil {
		t.Fatalf("Unable to generate test token: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+tokenPairs.Token)

	app := &application{auth: testAuth}
	handler := app.authRequired(http.HandlerFunc(testHandler))

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status == http.StatusUnauthorized {
		t.Errorf("Expected request to be authorized but got status code: %v", status)
	}
}

func TestEnableCORSWithOPTIONSMethod(t *testing.T) {
	req := httptest.NewRequest(http.MethodOptions, "/", nil)
	rr := httptest.NewRecorder()

	app := &application{auth: testAuth}
	handler := app.enableCORS(http.HandlerFunc(testHandler))

	handler.ServeHTTP(rr, req)

	headers := rr.Header()
	expectedMethods := "GET,POST,PUT,PATCH,DELETE,OPTIONS"

	if headers.Get("Access-Control-Allow-Methods") != expectedMethods {
		t.Errorf("Expected Access-Control-Allow-Methods to be %s, got %s", expectedMethods, headers.Get("Access-Control-Allow-Methods"))
	}
}

func TestAuthRequiredUnauthorized(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	app := &application{auth: testAuth}
	handler := app.authRequired(http.HandlerFunc(testHandler))

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("Expected unauthorized status code, got %v", status)
	}
}

func TestAuthRequiredWithExpiredToken(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	user := jwtUser{ID: 1, FirstName: "John", LastName: "Doe"}
	testAuth.tokenExpiry = -15 * time.Minute
	tokenPairs, err := testAuth.generateTokenPair(&user)
	if err != nil {
		t.Fatalf("Unable to generate test token: %v", err)
	}
	req.Header.Set("Authorization", "Bearer "+tokenPairs.Token)

	app := &application{auth: testAuth}
	handler := app.authRequired(http.HandlerFunc(testHandler))

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("Expected request to be unauthorized due to expired token but got status code: %v", status)
	}

	testAuth.tokenExpiry = 15 * time.Minute
}
