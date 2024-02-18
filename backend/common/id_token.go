package common

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

type NotValidateIDToken struct {
	idToken string
}

func NewNotValidateIDToken(idToken string) NotValidateIDToken {
	return NotValidateIDToken{idToken: idToken}
}

func (idToken NotValidateIDToken) ValidateIDToken() (IDToken, error) {
	jwksUrl := os.Getenv("JWKS_URL")
	if jwksUrl == "" {
		return IDToken{}, fmt.Errorf("JWKS_URL not set")
	}
	keys, err := fetchJwks(jwksUrl)
	if err != nil {
		return IDToken{}, err
	}
	parsedToken, err := jwt.Parse(idToken.idToken, func(token *jwt.Token) (interface{}, error) {
		//checkAud := token.Claims.(jwt.MapClaims).GetAudience()("aud", false)
		//if !checkAud {
		//	return nil, fmt.Errorf("invalid audience")
		//}
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, fmt.Errorf("kid header not found")
		}
		key, ok := keys[kid]
		if !ok {
			return nil, fmt.Errorf("key not found")
		}
		return key, nil
	})
	if err != nil {
		return IDToken{}, err
	}
	if !parsedToken.Valid {
		return IDToken{}, fmt.Errorf("token is invalid")
	}
	sub, ok := parsedToken.Claims.(jwt.MapClaims)["sub"].(string)
	if !ok {
		return IDToken{}, fmt.Errorf("sub claim not found")
	}
	aud, ok := parsedToken.Claims.(jwt.MapClaims)["aud"].(string)
	if !ok {
		return IDToken{}, fmt.Errorf("aud claim not found")
	}
	return IDToken{
		idToken: idToken.idToken,
		sub:     sub,
		aud:     aud,
	}, nil

}

type Jwks struct {
	Keys []Jwk `json:"keys"`
}

type Jwk struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

func fetchJwks(url string) (map[string]*rsa.PublicKey, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var jwks Jwks

	err = json.NewDecoder(resp.Body).Decode(&jwks)
	if err != nil {
		return nil, err
	}

	keys := make(map[string]*rsa.PublicKey)
	for _, jwk := range jwks.Keys {
		if len(jwk.X5c) == 0 {
			if jwk.Kty == "RSA" {
				nBytes, err := base64.RawURLEncoding.DecodeString(jwk.N)
				if err != nil {
					return nil, err
				}
				eBytes, err := base64.RawURLEncoding.DecodeString(jwk.E)
				if err != nil {
					return nil, err
				}
				n := new(big.Int).SetBytes(nBytes)
				e := int(new(big.Int).SetBytes(eBytes).Int64())

				pubKey := &rsa.PublicKey{N: n, E: e}
				keys[jwk.Kid] = pubKey
			}
			continue
		}
		key, err := jwt.ParseRSAPublicKeyFromPEM([]byte("-----BEGIN CERTIFICATE-----\n" + jwk.X5c[0] + "\n-----END CERTIFICATE-----"))
		if err != nil {
			return nil, err
		}
		keys[jwk.Kid] = key
	}
	return keys, nil
}

type IDToken struct {
	idToken string
	aud     string
	sub     string
}

func (idToken IDToken) String() string {
	return idToken.idToken
}

func (idToken IDToken) Sub() string {
	return idToken.sub
}
func (idToken IDToken) Aud() string {
	return idToken.aud
}

func (idToken IDToken) Email() string {
	return "email"
}
