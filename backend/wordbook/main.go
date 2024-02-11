package main

import (
	"ele/common"
	"ele/user"
	wordbook "ele/wordbook/pkg"
	"encoding/json"
	"net/http"
)

func main() {
	server := common.DefaultELEServer()
	server.RegisterHandler("/words", fetchWordInfoHandler)
	server.RegisterHandler("/deleteWord", deleteWordHandler)
	server.RegisterHandler("/registerWord", registerWordHandler)
	server.RegisterHandler("/updateWord", updateWordHandler)
	server.Start()
}

type updateWordRequest struct {
	user.UserId     `json:"userId"`
	wordbook.WordId `json:"wordId"`
	Meaning         string `json:"meaning"`
	Pronunciation   string `json:"pronunciation"`
	Remarks         string `json:"remarks"`
	Sentences       []struct {
		Value         string `json:"value"`
		Meaning       string `json:"meaning"`
		Pronunciation string `json:"pronunciation"`
	} `json:"sentences"`
}

func updateWordHandler(w http.ResponseWriter, r *http.Request) {
	var req updateWordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	updateReq := wordbook.UpdateWordRequest{
		WordId:        req.WordId,
		Meaning:       req.Meaning,
		Pronunciation: req.Pronunciation,
		Remarks:       req.Remarks,
	}
	wordInfo, err := wordbook.UpdateWord(req.UserId, wordbook.UpdateWordRequest(updateReq))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(wordInfo); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type registerWordRequest wordbook.RegisterWordRequest

func registerWordHandler(w http.ResponseWriter, r *http.Request) {
	var req registerWordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	wordInfo, err := wordbook.RegsiterWord(req.UserId, wordbook.RegisterWordRequest(req))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(wordInfo); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type deleteWordRequest struct {
	user.UserId     `json:"userId"`
	wordbook.WordId `json:"wordId"`
}
type deleteResponse struct {
	Message string `json:"message"`
}

func deleteWordHandler(w http.ResponseWriter, r *http.Request) {
	var req deleteWordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := wordbook.DeleteWord(req.UserId, req.WordId); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(deleteResponse{
		Message: "Deleted successfully!",
	}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type fetchWordInfoRequest struct {
	user.UserId `json:"userId"`
}

func fetchWordInfoHandler(w http.ResponseWriter, r *http.Request) {
	//var req fetchWordInfoRequest
	//if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
	//	http.Error(w, err.Error(), http.StatusBadRequest)
	//	return
	//}
	userId := user.UserId(r.URL.Query().Get("userId"))

	wordInfo, err := wordbook.FetchWordInfo(userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(wordInfo); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
