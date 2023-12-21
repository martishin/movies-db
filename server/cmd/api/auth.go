package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const headerTokenParts = 2

type auth struct {
	issuer        string
	audience      string
	secret        string
	tokenExpiry   time.Duration
	refreshExpiry time.Duration
	cookieDomain  string
	cookiePath    string
	cookieName    string
}

type jwtUser struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type tokenPair struct {
	Token        string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type claims struct {
	jwt.RegisteredClaims
}

func (j *auth) generateTokenPair(user *jwtUser) (tokenPair, error) {
	// Create a token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set the claims
	claims, _ := token.Claims.(jwt.MapClaims)
	claims["name"] = fmt.Sprintf("%s %s", user.FirstName, user.LastName)
	claims["sub"] = strconv.Itoa(user.ID)
	claims["aud"] = j.audience
	claims["iss"] = j.issuer
	claims["iat"] = time.Now().UTC().Unix()
	claims["typ"] = "JWT"

	// Set the expiry for JWT
	claims["exp"] = time.Now().UTC().Add(j.tokenExpiry).Unix()

	// Create a signed token
	signedAccessToken, err := token.SignedString([]byte(j.secret))
	if err != nil {
		return tokenPair{}, err
	}

	// Create a refresh token and set claims
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	refreshTokenClaims, _ := refreshToken.Claims.(jwt.MapClaims)
	refreshTokenClaims["sub"] = strconv.Itoa(user.ID)
	refreshTokenClaims["iat"] = time.Now().UTC().Unix()

	// Set the expiry for the refresh token
	refreshTokenClaims["exp"] = time.Now().UTC().Add(j.refreshExpiry).Unix()

	// Create signed refresh token
	signedRefreshToken, err := refreshToken.SignedString([]byte(j.secret))
	if err != nil {
		return tokenPair{}, err
	}

	// Create TokenPairs and populate with signed tokens
	var tokenPairs = tokenPair{
		Token:        signedAccessToken,
		RefreshToken: signedRefreshToken,
	}

	// Return TokenPairs
	return tokenPairs, nil
}

func (j *auth) getRefreshCookie(refreshToken string) *http.Cookie {
	return &http.Cookie{
		Name:     j.cookieName,
		Path:     j.cookiePath,
		Value:    refreshToken,
		Expires:  time.Now().Add(j.refreshExpiry),
		MaxAge:   int(j.refreshExpiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		// Domain:   j.cookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (j *auth) getExpiredRefreshCookie() *http.Cookie {
	return &http.Cookie{
		Name:     j.cookieName,
		Path:     j.cookiePath,
		Value:    "",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteStrictMode,
		// Domain:   j.cookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (j *auth) getTokenFromHeaderAndVerify(w http.ResponseWriter, r *http.Request) (string, *claims, error) {
	w.Header().Add("Vary", "Authorization")

	// get auth header
	authHeader := r.Header.Get("Authorization")

	// sanity check
	if authHeader == "" {
		return "", nil, errors.New("no auth header")
	}

	// split the header on spaces
	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != headerTokenParts {
		return "", nil, errors.New("invalid auth header")
	}

	// check to see if we have the word Bearer
	if headerParts[0] != "Bearer" {
		return "", nil, errors.New("invalid auth header")
	}

	token := headerParts[1]

	// declare an empty claims
	claims := &claims{}

	// parse the token
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(j.secret), nil
	})

	if err != nil {
		if strings.HasPrefix(err.Error(), "token is expired by") {
			return "", nil, errors.New("expired token")
		}
		return "", nil, err
	}

	if claims.Issuer != j.issuer {
		return "", nil, errors.New("invalid issuer")
	}

	return token, claims, nil
}
