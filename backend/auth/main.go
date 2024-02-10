package main

import (
	"ele/common"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

func main() {
	server := common.DefaultELEServer()
	server.RegisterHandler("/callback", callback)
	server.Start()
}

func callback(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	b := []byte{}
	r.Body.Read(b)
	if len(b) > 0 {
		println(string(b))
		return
	}
	code := r.URL.Query().Get("code")
	cognitoDomain := os.Getenv("COGNITO_DOMAIN")

	values := url.Values{}
	values.Set("grant_type", "authorization_code")
	values.Set("client_id", os.Getenv("COGNITO_CLIENT_ID"))
	values.Set("code", code)
	values.Set("redirect_uri", "http://localhost:8080/callback")

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/oauth2/token", cognitoDomain), strings.NewReader(values.Encode()))
	if err != nil {
		fmt.Println(err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	srcAuth := fmt.Sprintf("%s:%s", os.Getenv("COGNITO_CLIENT_ID"), os.Getenv("COGNITO_CLIENT_SECRET"))
	base := base64.StdEncoding.EncodeToString([]byte(srcAuth))

	if err != nil {
		fmt.Println(err)
	}
	req.Header.Set("Authorization", "Basic "+string(base))

	client := &http.Client{}
	tokenRes, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
	}
	defer tokenRes.Body.Close()
	println(tokenRes.Status)
	b = []byte{}
	b, err = io.ReadAll(tokenRes.Body)
	// redirect to the frontend
	w.Header().Set("Location", fmt.Sprintf("http://localhost:3000?token=%s", string(b)))
	w.WriteHeader(http.StatusFound)
	w.Write(b)
}
