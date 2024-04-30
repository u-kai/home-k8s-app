package pkg

import (
	"context"
	"ele/openai"
	"fmt"
	"strings"
)

func GenerateSentence(ctx context.Context, source string) (GenerateSentenceResult, error) {
	client, err := openai.FromEnv()
	if err != nil {
		return GenerateSentenceResult{}, fmt.Errorf("failed to get client: %w", err)
	}

	prompt := generateSentencePrompt(source)
	messages := []openai.ChatMessage{
		{
			Role:    openai.User,
			Content: prompt,
		},
	}
	res, err := client.Chat(ctx, messages, openai.Gpt4)
	if err != nil {
		return GenerateSentenceResult{}, fmt.Errorf("Failed to create sentence: %s", err.Error())
	}
	lines := strings.Split(res, "\n")
	if len(lines) < 2 {
		return GenerateSentenceResult{}, fmt.Errorf("Failed to create sentence: %s", "Invalid response")
	}
	var result GenerateSentenceResult
	for _, line := range lines {
		if len(line) == 0 {
			continue
		}
		if result.Result == "" {
			result.Result = line
			continue
		}
		result.Meaning = line
	}

	return result, nil
}
func generateSentencePrompt(source string) string {
	return fmt.Sprintf("1行目に「%s」を使った例文を返答してください。2行目に1行目で作った例文の日本語翻訳を返答して下さい。それ以外の返答は一切不要です。", source)
}

type GenerateSentenceResult struct {
	Result  string `json:"result"`
	Meaning string `json:"meaning"`
}
