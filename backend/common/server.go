package common

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
)

type ELEServer struct {
	port         int
	service      string
	frontendHost string
}

func DefaultELEServer(service string) *ELEServer {
	return NewELEServer(service, frontendHostFromEnv(), 8080)
}

func NewELEServer(service, frontend string, port int) *ELEServer {
	return &ELEServer{
		service:      service,
		port:         port,
		frontendHost: frontend,
	}
}

func (s *ELEServer) RegisterHandler(route string, handler http.HandlerFunc) {
	http.HandleFunc("/"+s.service+route, http.HandlerFunc(corsMiddleware(http.HandlerFunc(handler), s.frontendHost).ServeHTTP))
}

func (s *ELEServer) Start() {
	addr := fmt.Sprintf(":%d", s.port)
	s.RegisterHandler("/health", healthHandler)
	slog.Info("Starting server", "addr", addr)
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		slog.Error("Failed to start server", "error", err.Error())
	}
}

// Req is the type of the request body, so that it can be decoded from JSON
// Resp is the type of the response body
type PostHandler[Req any, Resp json.Marshaler] func(req *Req) (Resp, error)

func CreatePostHandler[Req any, Resp json.Marshaler](h PostHandler[Req, Resp]) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req := new(Req)
		err := json.NewDecoder(r.Body).Decode(req)
		slog.Info("Request", "req", req)
		if err != nil {
			slog.Error("Failed to decode request body", "error", err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp, err := h(req)
		if err != nil {
			slog.Error("Failed to handle request", "error", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		slog.Info("Response", "resp", resp)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

type Query map[string][]string

// Req is the type of the request body, so that it can be decoded from JSON
// Resp is the type of the response body
type GetHandlerWithAuthorization[Resp json.Marshaler] func(query Query, idToken IDToken) (Resp, error)

func CreateGetHandlerWithIDToken[Req Query, Resp json.Marshaler](h GetHandlerWithAuthorization[Resp]) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := make(Query)
		for k, v := range r.URL.Query() {
			query[k] = v
		}
		idToken, err := idTokenFromHeader(r)
		if err != nil {
			slog.Error("Failed to get idToken", "error", err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp, err := h(query, idToken)
		if err != nil {
			slog.Error("Failed to handle request", "error", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		slog.Info("Response", "resp", resp)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

// Req is the type of the request body, so that it can be decoded from JSON
// Resp is the type of the response body
type PostHandlerWithAuthorization[Req any, Resp json.Marshaler] func(req *Req, idToken IDToken) (Resp, error)

func CreatePostHandlerWithIDToken[Req any, Resp json.Marshaler](h PostHandlerWithAuthorization[Req, Resp]) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req := new(Req)
		err := json.NewDecoder(r.Body).Decode(req)
		slog.Info("Request", "req", req)
		if err != nil {
			slog.Error("Failed to decode request body", "error", err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		idToken, err := idTokenFromHeader(r)
		if err != nil {
			slog.Error("Failed to get idToken", "error", err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp, err := h(req, idToken)
		if err != nil {
			slog.Error("Failed to handle request", "error", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		slog.Info("Response", "resp", resp)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

func idTokenFromHeader(r *http.Request) (IDToken, error) {
	token, err := getAuthToken(r)
	if err != nil {
		return IDToken{}, err
	}
	return fetchIDToken(token)
}

func fetchIDToken(token string) (IDToken, error) {
	notValidateToken := NewNotValidateIDToken(token)
	idToken, err := notValidateToken.ValidateIDToken()
	if err != nil {
		return IDToken{}, err
	}
	return idToken, nil
}

func getAuthToken(r *http.Request) (string, error) {
	token := r.Header.Get("Authorization")
	if token == "" {
		return "", fmt.Errorf("Authorization header is empty")
	}
	token = strings.Replace(token, "Bearer ", "", 1)
	return token, nil
}

// chan owner ship is PostSSEHandler
type PostSSEHandler[Req any, Resp json.Marshaler] func(req *Req) (<-chan Resp, <-chan error)

func CreatePostSSEHandler[Req any, Resp json.Marshaler](h PostSSEHandler[Req, Resp]) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req := new(Req)
		err := json.NewDecoder(r.Body).Decode(req)
		if err != nil {
			slog.Error("Failed to decode request body", "error", err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		slog.Info("Request", "req", req)
		respStream, errStream := h(req)

		f, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		logBuffer := ""
		for {
			select {
			case data, ok := <-respStream:
				if !ok {
					slog.Info("Stream closed", "sended", logBuffer)
					return
				}
				json, err := data.MarshalJSON()
				if err != nil {
					slog.Error("Failed to marshal response", "error", err.Error())
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				sendData := string(json)
				fmt.Fprintf(w, "data: %s\n\n", sendData)
				f.Flush()
				logBuffer += sendData
			case err, ok := <-errStream:
				if !ok || err == nil {
					return
				}
				slog.Error("Error in SSEHandler", "error", err.Error())
				http.Error(w, "Error in SSEHandler", http.StatusInternalServerError)
				return
			case <-r.Context().Done():
				return
			}
		}
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	slog.Info("Health check", "from", r.RemoteAddr, "frontend", os.Getenv("FRONTEND_HOST"))
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func corsMiddleware(next http.Handler, frontendHost string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set the CORS headers
		w.Header().Set("Access-Control-Allow-Origin", frontendHost)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin, X-Requested-With")

		// If this is a preflight request, stop here
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Serve the next handler
		next.ServeHTTP(w, r)
	})
}

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
	})
}

func frontendHostFromEnv() string {
	if os.Getenv("FRONTEND_HOST") == "" {
		return "*"
	}
	return os.Getenv("FRONTEND_HOST")
}
