package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"common/pkg"

	"cloud.google.com/go/translate"
	"golang.org/x/text/language"
)

func main() {
	// Start the server
	server := pkg.DefaultELEServer()
	server.RegisterHandler("/translate", translateHandler)
	server.Start()
}

func translateHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	len := r.ContentLength
	b := make([]byte, len)

	_, err := r.Body.Read(b)

	if err != nil && err.Error() != "EOF" {
		log.Printf("Failed to read request body: %s", err.Error())
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Create a new TranslateRequest

	req := new(TranslateRequest)
	err = json.Unmarshal(b, req)
	if err != nil {
		log.Printf("Failed to unmarshal request body: %s", err.Error())
		http.Error(w, "Failed to unmarshal request body", http.StatusBadRequest)
		return
	}
	target, err := newTranslateTarget(*req)
	if err != nil {
		http.Error(w, "Failed to create translate target. Request is too big.", http.StatusBadRequest)
		return
	}
	results, err := target.TranslateToJP()
	if err != nil {
		log.Printf("Failed to translate text: %s", err.Error())
		http.Error(w, "Failed to translate text", http.StatusInternalServerError)
		return
	}
	res := TranslateResponse{
		Target:  target,
		Results: results,
	}

	resBytes, err := json.Marshal(res)
	if err != nil {
		log.Printf("Failed to marshal response: %s", err.Error())
		http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(resBytes)
	if err != nil {
		log.Printf("Failed to write response: %s", err.Error())
		http.Error(w, "Failed to write response", http.StatusInternalServerError)
		return
	}
}

type TranslateRequest struct {
	Target string `json:"target"`
}

type TranslateTarget string

type TranslateResponse struct {
	Target  TranslateTarget `json:"target"`
	Results []string        `json:"results"`
}

func (t TranslateTarget) TranslateToJP() ([]string, error) {
	//return TranslateText("ja", string(t))
	return []string{string(t)}, nil
}

func newTranslateTarget(req TranslateRequest) (TranslateTarget, error) {
	if len(req.Target) > textLimit(req.Target) {
		return TranslateTarget(""), fmt.Errorf("text is too long")
	}
	return TranslateTarget(req.Target), nil
}

func textLimit(text string) int {
	const DEFAULT_TEXT_LIMIT = 30
	if os.Getenv("TEXT_LIMIT") == "" {
		return DEFAULT_TEXT_LIMIT
	}
	limit, err := strconv.Atoi(os.Getenv("TEXT_LIMIT"))
	if err != nil {
		return DEFAULT_TEXT_LIMIT
	}
	return limit
}

func TranslateText(targetLanguage, text string) ([]string, error) {
	ctx := context.Background()

	lang, err := language.Parse(targetLanguage)

	if err != nil {
		return nil, fmt.Errorf("language.Parse: %w", err)
	}

	client, err := translate.NewClient(ctx)

	if err != nil {
		return nil, err
	}

	defer client.Close()

	resp, err := client.Translate(ctx, []string{text}, lang, nil)

	if err != nil {
		return nil, fmt.Errorf("translate: %w", err)
	}

	if len(resp) == 0 {
		return nil, fmt.Errorf("translate returned empty response to text: %s", text)
	}

	result := make([]string, 0, len(resp))

	for _, r := range resp {
		result = append(result, r.Text)
	}

	return result, nil
}
