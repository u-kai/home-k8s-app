package main

import (
	"ele/common"
	"ele/user"
	wordbook "ele/wordbook/pkg"
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
)

// TODO: AUTHORIZATION CHECK
func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	server := common.DefaultELEServer("wordbook")
	server.RegisterHandler("/words", fetchWordInfoHandler(logger))
	server.RegisterHandler("/deleteWord", deleteWordHandler(logger))
	server.RegisterHandler("/registerWord", registerWordHandler(logger))
	server.RegisterHandler("/updateWord", updateWordHandler(logger))
	// Start the server
	server.Start()
}

func fetchWordInfoHandler(logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger.Info("start fetchWordInfoHandler")
		userId := user.UserId(r.URL.Query().Get("userId"))
		if userId == "" {
			logger.Error("userId is empty")
			http.Error(w, "userId is empty", http.StatusBadRequest)
			return
		}
		db, err := common.FromEnv().Open()
		defer db.Close()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to open db", "api", "fetchWordInfoHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		wordInfo, err := wordbook.FetchWordProfileFromDBByUserId(db, userId)
		logger.Info("wordInfo", wordInfo)
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to fetch word info", "api", "fetchWordInfoHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := json.NewEncoder(w).Encode(wordInfo); err != nil {
			logger.Error(err.Error(), "reason", "failed to encode word info", "api", "fetchWordInfoHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		logger.Info("end fetchWordInfoHandler")
	}
}

func updateWordHandler(logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger.Info("start updateWordHandler")
		var req wordbook.UpdateWordProfileApiSchema
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			logger.Error(err.Error(), "reason", "failed to decode request", "api", "updateWordHandler")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		updateSrc, err := req.ToUpdatedWordProfileSource()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to convert to updated word profile source", "api", "updateWordHandler")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		db, err := common.FromEnv().Open()
		defer db.Close()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to open db", "api", "updateWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		wordInfo, err := wordbook.UpdateWordProfileByDB(db, updateSrc)
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to update word profile", "api", "updateWordHandler", "wordProfile", wordInfo, "updateSrc", updateSrc)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(wordInfo); err != nil {
			logger.Error(err.Error(), "reason", "failed to encode word info", "api", "updateWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		logger.Info("end updateWordHandler")
	}
}

func registerWordHandler(logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger.Info("start registerWordHandler")
		var req wordbook.RegisterWordProfileApiSchema
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			logger.Error(err.Error(), "reason", "failed to decode request", "api", "registerWordHandler")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		logger.Info("registerWordHandler", "req", req)
		db, err := common.FromEnv().Open()
		defer db.Close()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to open db", "api", "registerWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		src, err := req.ToRegisterWordProfileSource()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to convert to register word profile source", "api", "registerWordHandler", "src", src, "req", req, "req.Word")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		wordInfo, err := wordbook.RegisterWordProfileByDB(db, src)
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to register word profile", "api", "registerWordHandler", "src", src)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(wordInfo); err != nil {
			logger.Error(err.Error(), "reason", "failed to encode word info", "api", "registerWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		logger.Info("end registerWordHandler")
	}

}

type deleteResponse struct {
	Message string `json:"message"`
}

func deleteWordHandler(logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logger.Info("start deleteWordHandler")
		var req wordbook.DeleteWordProfileApiSchema
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			logger.Error(err.Error(), "reason", "failed to decode request", "api", "deleteWordHandler")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		src, err := req.ToDeleteWordProfileSource()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to convert to delete word profile source", "api", "deleteWordHandler")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		db, err := common.FromEnv().Open()
		if err != nil {
			logger.Error(err.Error(), "reason", "failed to open db", "api", "deleteWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer db.Close()
		if err := wordbook.DeleteWordProfileByDB(db, src); err != nil {
			logger.Error(err.Error(), "reason", "failed to delete word profile", "api", "deleteWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(deleteResponse{
			Message: "Deleted successfully!",
		}); err != nil {
			logger.Error(err.Error(), "reason", "failed to encode delete response", "api", "deleteWordHandler")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		logger.Info("end deleteWordHandler")
	}
}
