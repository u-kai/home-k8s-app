package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"ele/common"
	"ele/translate/pkg"
	"ele/user"
)

func main() {
	logger := common.NewJsonLogger()
	server := common.DefaultELEServer("translate")

	server.RegisterHandler("/", translateHandler(logger))
	server.RegisterHandler("/translateSentence", translateSentenceHandler(logger))
	server.RegisterHandler("/reviewSentence", reviewSentenceHandler(logger))
	server.RegisterHandler("/generateSentence", generateSentenceHandler(logger))
	// TODO:Remove
	server.RegisterHandler("/createSentence", generateSentenceHandler(logger))

	logger.Info("Starting Translate server...")
	server.Start()
}

type translateSentenceRequest struct {
	Sentence string `json:"sentence"`
	Lang     string `json:"lang"`
}

func translateSentenceHandler(logger *slog.Logger) http.HandlerFunc {
	return common.NewSSEHandler(func(w http.ResponseWriter, r *http.Request) (<-chan string, <-chan error) {
		errStream := make(chan error, 1)
		defer r.Body.Close()
		body, err := io.ReadAll(r.Body)
		if err != nil {
			logger.Error("Failed to read request body: %s", err.Error(), "api", "translateSentenceHandler", "r", r)
			errStream <- fmt.Errorf("Failed to read request body: %w", err)
			close(errStream)
			return nil, errStream
		}
		req := new(translateSentenceRequest)
		err = json.Unmarshal(body, req)
		if err != nil {
			logger.Error("Failed to unmarshal request body: %s", err.Error(), "api", "translateSentenceHandler", "r", r)
			errStream <- fmt.Errorf("Failed to unmarshal request body: %w", err)
			close(errStream)
			return nil, errStream
		}
		if req.Lang == "" {
			req.Lang = "ja"
		}
		return pkg.TranslateSentenceStream(r.Context(), req.Sentence, req.Lang)
	})
}

type reviewSentenceRequest struct {
	Sentence string `json:"sentence"`
}

func reviewSentenceHandler(logger *slog.Logger) http.HandlerFunc {
	return common.NewSSEHandler(func(w http.ResponseWriter, r *http.Request) (<-chan string, <-chan error) {
		errStream := make(chan error, 1)
		defer r.Body.Close()
		body, err := io.ReadAll(r.Body)
		if err != nil {
			logger.Error("Failed to read request body: %s", err.Error(), "api", "reviewSentenceHandler", "r", r)
			errStream <- fmt.Errorf("Failed to read request body: %w", err)
			close(errStream)
			return nil, errStream
		}
		req := new(reviewSentenceRequest)
		err = json.Unmarshal(body, req)
		if err != nil {
			logger.Error("Failed to unmarshal request body: %s", err.Error(), "api", "reviewSentenceHandler", "r", r)
			errStream <- fmt.Errorf("Failed to unmarshal request body: %w", err)
			close(errStream)
			return nil, errStream
		}
		return pkg.ReviewSentenceStream(r.Context(), req.Sentence)
	})
}

type generateSentenceRequest struct {
	Word   string `json:"word"`
	UserId string `json:"userId"`
}

func generateSentenceHandler(logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		body, err := io.ReadAll(r.Body)
		if err != nil && err.Error() != "EOF" {
			logger.Error("Failed to read request body: %s", err.Error(), "api", "generateSentenceHandler", "r", r)
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}
		req := new(generateSentenceRequest)
		err = json.Unmarshal(body, req)
		if err != nil {
			logger.Error("Failed to unmarshal request body: %s", err.Error(), "api", "generateSentenceHandler", "r", r)
			http.Error(w, "Failed to unmarshal request body", http.StatusBadRequest)
			return
		}
		userId := user.UserId(req.UserId)
		if err := user.AuthUserFromHeaderWithFeatureFlag(r, userId); err != nil {
			logger.Error(err.Error(), "reason", "failed to auth user", "api", "generateSentenceHandler")
			http.Error(w, "Failed to auth user", http.StatusUnauthorized)
			return
		}
		for i := 0; i < 3; i++ {
			generateResult, err := pkg.GenerateSentence(r.Context(), req.Word)
			if err != nil {
				if i == 2 {
					logger.Error("Failed to generate sentence: %s", err.Error(), "api", "generateSentenceHandler", "r", r)
					http.Error(w, "Failed to generate sentence", http.StatusInternalServerError)
					return
				}
				continue
			}

			resBytes, err := json.Marshal(generateResult)
			if err != nil {
				logger.Error("Failed to marshal response: %s", err.Error(), "api", "generateSentenceHandler", "r", r)
				http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write(resBytes)
			slog.Info("end generateSentenceHandler")
		}
	}
}

type TranslateRequest struct {
	UserId   string `json:"userId"`
	Target   string `json:"target"`
	FromLang string `json:"fromLang"`
	ToLang   string `json:"toLang"`
}

type TranslateResponse struct {
	// Lang
	Target  string   `json:"target"`
	Results []string `json:"results"`
}

func translateHandler(logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		len := r.ContentLength
		b := make([]byte, len)

		_, err := r.Body.Read(b)

		if err != nil && err.Error() != "EOF" {
			logger.Error("Failed to read request body: "+err.Error(), "err", err, "r", r)
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		// Create a new TranslateRequest

		req := new(TranslateRequest)
		err = json.Unmarshal(b, req)
		if err != nil {
			logger.Error("Failed to unmarshal request body: "+err.Error(), "err", err, "req", req)
			http.Error(w, "Failed to unmarshal request body", http.StatusBadRequest)
			return
		}
		userId := user.UserId(req.UserId)
		if err := user.AuthUserFromHeaderWithFeatureFlag(r, userId); err != nil {
			logger.Error(err.Error(), "reason", "failed to auth user", "api", "translateHandler")
			http.Error(w, "Failed to auth user", http.StatusUnauthorized)
			return
		}

		if err != nil {
			logger.Error("Failed to generate translate target: "+err.Error(), "err", err, "req", req)
			http.Error(w, "Failed to generate translate target. Request is too big.", http.StatusBadRequest)
			return
		}
		results, err := pkg.Translate(r.Context(), req.Target, req.ToLang)
		if err != nil {
			logger.Error("Failed to translate text: "+err.Error(), "err", err, "req", req)
			http.Error(w, "Failed to translate text", http.StatusInternalServerError)
			return
		}
		res := TranslateResponse{
			Target:  req.Target,
			Results: []string{results},
		}

		resBytes, err := json.Marshal(res)
		if err != nil {
			logger.Error("Failed to marshal response: "+err.Error(), "err", err, "res", res)
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(resBytes)
		if err != nil {
			logger.Error("Failed to write response: "+err.Error(), "err", err)
			http.Error(w, "Failed to write response", http.StatusInternalServerError)
			return
		}
		logger.Info("end translateHandler")
	}
}
