package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

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

// type claims struct {
// 	jwt.RegisteredClaims
// }

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

// func (j *auth) getExpiredRefreshCookie() *http.Cookie {
// 	return &http.Cookie{
// 		Name:     j.cookieName,
// 		Path:     j.cookiePath,
// 		Value:    "",
// 		Expires:  time.Unix(0, 0),
// 		MaxAge:   -1,
// 		SameSite: http.SameSiteStrictMode,
// 		Domain:   j.cookieDomain,
// 		HttpOnly: true,
// 		Secure:   true,
// 	}
// }
