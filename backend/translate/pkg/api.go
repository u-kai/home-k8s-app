package pkg

import (
	"context"
	"ele/common"
	"ele/openai"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
)

type AIModel string

const (
	Premium AIModel = "premium"
	Greater AIModel = "greater"
	Normal  AIModel = "normal"
)

func convertToChatGPTModel(model AIModel) openai.ChatGPTModel {
	switch model {
	case Premium:
		return openai.Gpt4Turbo
	case Greater:
		return openai.Gpt4o
	case Normal:
		return openai.Gpt3Dot5Turbo
	default:
		return openai.Gpt3Dot5Turbo
	}
}

type GenerateSentenceRequest struct {
	Word    string `json:"word"`
	AIModel string `json:"aiModel"`
}

type GenerateSentenceResponse struct {
	Result  string `json:"result"`
	Meaning string `json:"meaning"`
}

func (resp GenerateSentenceResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Result  string `json:"result"`
		Meaning string `json:"meaning"`
	}{
		resp.Result,
		resp.Meaning,
	})
}

func GenerateSentenceHandler(ctx context.Context) http.HandlerFunc {
	return common.CreatePostHandler(func(req *GenerateSentenceRequest) (GenerateSentenceResponse, error) {
		model := convertToChatGPTModel(AIModel(req.AIModel))
		res, err := GenerateSentence(ctx, req.Word, model)
		if err != nil {
			return GenerateSentenceResponse{}, err
		}
		return GenerateSentenceResponse{Result: res.Result, Meaning: res.Meaning}, nil
	})
}

type ReviewSentenceRequest struct {
	Sentence string `json:"sentence"`
	AIModel  string `json:"aiModel"`
}

type ReviewSentenceResponse string

func (r ReviewSentenceResponse) MarshalJSON() ([]byte, error) {
	// When converting it to JSON directly, it adds double quotes to the strings,so we will only perform to type conversion.
	return []byte(r), nil
}

func ReviewSentenceStreamHandler(ctx context.Context) http.HandlerFunc {
	return common.CreatePostSSEHandler(func(req *ReviewSentenceRequest) (<-chan ReviewSentenceResponse, <-chan error) {
		model := convertToChatGPTModel(AIModel(req.AIModel))
		stringStream, errStream := ReviewSentenceStream(ctx, req.Sentence, model)
		result := make(chan ReviewSentenceResponse)
		newErrStream := make(chan error, 1)
		go func() {
			defer close(newErrStream)
			defer close(result)
			for {
				select {
				case <-ctx.Done():
					newErrStream <- ctx.Err()
					return
				case err := <-errStream:
					newErrStream <- err
					return
				case res, ok := <-stringStream:
					if !ok {
						return
					}
					result <- ReviewSentenceResponse(res)
				}
			}
		}()
		return result, newErrStream
	})
}

type TranslateRequest struct {
	Word    string `json:"word"`
	ToLang  string `json:"toLang"`
	AIModel string `json:"aiModel"`
}

type TranslateResponse struct {
	Result string `json:"result"`
}

func (resp TranslateResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Result string `json:"result"`
	}{
		resp.Result,
	})
}

func TranslateHandler(ctx context.Context) http.HandlerFunc {
	return common.CreatePostHandler(func(req *TranslateRequest) (TranslateResponse, error) {
		model := convertToChatGPTModel(AIModel(req.AIModel))
		res, err := Translate(ctx, req.Word, req.ToLang, model)
		if err != nil {
			return TranslateResponse{}, fmt.Errorf("failed to translate: %w", err)
		}
		return TranslateResponse{Result: res}, nil
	})
}

type TranslateSentenceRequest struct {
	Sentence string `json:"sentence"`
	ToLang   string `json:"toLang"`
	AIModel  string `json:"aiModel"`
}

type TranslateSentenceResponse string

func (t TranslateSentenceResponse) MarshalJSON() ([]byte, error) {
	// When converting it to JSON directly, it adds double quotes to the strings,so we will only perform to type conversion.
	return []byte(t), nil
}

func TranslateSentenceStreamHandler(ctx context.Context) http.HandlerFunc {
	return common.CreatePostSSEHandler(func(req *TranslateSentenceRequest) (<-chan TranslateSentenceResponse, <-chan error) {
		model := convertToChatGPTModel(AIModel(req.AIModel))
		stringStream, errStream := TranslateSentenceStream(ctx, req.Sentence, req.ToLang, model)
		result := make(chan TranslateSentenceResponse)
		newErrStream := make(chan error, 1)
		go func() {
			defer close(newErrStream)
			defer close(result)
			for {
				select {
				case <-ctx.Done():
					if ctx.Err() != nil {
						newErrStream <- ctx.Err()
					}
					return
				case err, ok := <-errStream:
					if !ok {
						slog.Info("Translate Sentence Stream closed successfully")
						return
					}
					newErrStream <- err
					return
				case res, ok := <-stringStream:
					if !ok {
						return
					}
					result <- TranslateSentenceResponse(res)
				}
			}
		}()
		return result, newErrStream
	})
}
