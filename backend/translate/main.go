package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"strconv"

	"ele/common"

	"cloud.google.com/go/translate"
	"golang.org/x/text/language"
)

func main() {
	// Start the server
	server := common.DefaultELEServer("translate")
	server.RegisterHandler("/", translateHandler)
	server.RegisterHandler("/createSentence", createSentenceHandler)
	server.Start()
}

type sentence struct {
	Sentence string `json:"sentence"`
	Meaning  string `json:"meaning"`
}
type createSentenceRequest struct {
	Word string `json:"word"`
}

func createSentenceHandler(w http.ResponseWriter, r *http.Request) {
	slog.Info("start createSentenceHandler")
	defer r.Body.Close()
	len := r.ContentLength
	b := make([]byte, len)

	_, err := r.Body.Read(b)
	if err != nil && err.Error() != "EOF" {
		log.Printf("Failed to read request body: %s", err.Error())
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	req := new(createSentenceRequest)
	err = json.Unmarshal(b, req)
	if err != nil {
		slog.Error("Failed to unmarshal request body: %s", err.Error())
		http.Error(w, "Failed to unmarshal request body", http.StatusBadRequest)
		return
	}
	var sentence sentence
	for i := 0; i < 3; i++ {
		sentence, err = createSentence(req.Word)
		if err == nil {
			break
		}
		if err != nil && i == 2 {
			slog.Error("Failed to create sentence: %s", err.Error())
			http.Error(w, "Failed to create sentence", http.StatusInternalServerError)
			return
		}
	}
	resBytes, err := json.Marshal(sentence)
	if err != nil {
		slog.Error("Failed to marshal response: %s", err.Error())
		http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resBytes)
	slog.Info("end createSentenceHandler")
}

func createSentence(source string) (sentence, error) {
	prompt := fmt.Sprintf("「%s」を使った例文を作ってください。そしてその意味を日本語で教えて下さい。そして返答としては、jsonで返してほしくて、{\"sentence\":\"作成した例文\",\"meaning\":\"日本語翻訳\"}でお願いします。", source)
	res, err := gptRequest(prompt)
	if err != nil {
		return sentence{}, fmt.Errorf("Failed to create sentence: %s", err.Error())
	}
	result := new(sentence)
	err = json.Unmarshal([]byte(res), result)
	if err != nil {
		return sentence{}, fmt.Errorf("Failed to unmarshal response: %s", err.Error())
	}
	return *result, nil
}

func translateHandler(w http.ResponseWriter, r *http.Request) {
	slog.Info("start translateHandler")
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
	results, err := target.TranslateToJP(req.FromLang, req.ToLang)
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
	slog.Info("end translateHandler")
}

type TranslateRequest struct {
	Target   string `json:"target"`
	FromLang string `json:"fromLang"`
	ToLang   string `json:"toLang"`
}

type TranslateTarget string

type TranslateResponse struct {
	Target  TranslateTarget `json:"target"`
	Results []string        `json:"results"`
}

func (t TranslateTarget) TranslateToJP(fromLang, toLang string) ([]string, error) {
	result, err := TranslateByGPT(toLang, string(t))
	return []string{result}, err
	//return Translate(fromLang, toLang, string(t))
	//return []string{string(t)}, nil
}

func newTranslateTarget(req TranslateRequest) (TranslateTarget, error) {
	if len(req.Target) > textLimit(req.Target) {
		return TranslateTarget(""), fmt.Errorf("text is too long")
	}
	return TranslateTarget(req.Target), nil
}

type Request struct {
	Target string `json:"target"`
	Text   string `json:"text"`
	Source string `json:"source"`
}
type GptRequest struct {
	Model    string `json:"model"`
	Messages []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
}

type GptResponse struct {
	Choices []struct {
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func gptRequest(prompt string) (string, error) {
	gptKey := os.Getenv("OPENAI_API_KEY")
	client := &http.Client{}
	url := "https://api.openai.com/v1/chat/completions"
	b, err := json.Marshal(GptRequest{
		Model: "gpt-3.5-turbo",
		Messages: []struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		}{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	})
	if err != nil {
		return "", err
	}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(b))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", gptKey))
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	var gptResp GptResponse
	err = json.NewDecoder(resp.Body).Decode(&gptResp)
	if err != nil {
		return "", err
	}
	return gptResp.Choices[0].Message.Content, nil
}

func TranslateByGPT(toLang, text string) (string, error) {
	content := fmt.Sprintf("「%s」という単語を%sに翻訳して.返答の形式としては、略した単語のみにしてください.", text, toLang)
	result, err := gptRequest(content)
	if err != nil {
		return "", err
	}
	return result, nil
}

func Translate(fromLang, toLang, text string) ([]string, error) {
	client := &http.Client{}
	b, err := json.Marshal(Request{
		Target: toLang,
		Text:   text,
		Source: fromLang,
	})
	if err != nil {
		return nil, err
	}
	url := fmt.Sprintf("https://www.googleapis.com/language/translate/v2?key=%s&source=%s&target=%s&q=%s", os.Getenv("GOOGLE_TRANSLATE_KEY"), fromLang, toLang, text)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(b))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	fmt.Println("GOOGLE_TRANSLATE_API_KEY", os.Getenv("GOOGLE_TRANSLATE_KEY"))
	resp, err := client.Do(req)
	if err != nil {
		println(err.Error())
		return nil, err
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	fmt.Println("resp %v", resp)
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, err
	}
	translations := result["data"].(map[string]interface{})["translations"].([]interface{})
	translatedTexts := make([]string, 0, len(translations))
	for _, t := range translations {
		translatedTexts = append(translatedTexts, t.(map[string]interface{})["translatedText"].(string))
	}
	return translatedTexts, nil
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
