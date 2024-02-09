package pkg

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

type ELEServer struct {
	port         int
	frontendHost string
}

func DefaultELEServer() *ELEServer {
	return NewELEServer(frontendHostFromEnv(), 8080)
}

func NewELEServer(host string, port int) *ELEServer {
	return &ELEServer{
		port:         port,
		frontendHost: host,
	}
}

func (s *ELEServer) RegisterHandler(route string, handler http.HandlerFunc) {
	http.HandleFunc("/", http.HandlerFunc(corsMiddleware(http.HandlerFunc(handler), s.frontendHost).ServeHTTP))
}

func (s *ELEServer) Start() {
	addr := fmt.Sprintf(":%d", s.port)
	log.Printf("Starting server on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
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

func frontendHostFromEnv() string {
	if os.Getenv("FRONTEND_HOST") == "" {
		return "http://localhost:3000"
	}
	return os.Getenv("FRONTEND_HOST")
}
