package common

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
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
	log.Printf("Starting server on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
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
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

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
