package pkg

import (
	"context"
	"ele/openai"
	"fmt"
	"os"
	"strconv"
)

func TranslateSentenceStream(ctx context.Context, sentence, lang string) (<-chan string, <-chan error) {
	errStream := make(chan error, 1)
	client, err := openai.FromEnv()
	if err != nil {
		errStream <- fmt.Errorf("failed to get client: %w", err)
		close(errStream)
		return nil, errStream
	}
	if len(sentence) > sentenceLimit(sentence) {
		errStream <- fmt.Errorf("sentence is too long")
		close(errStream)
		return nil, errStream
	}
	messages := []openai.ChatMessage{
		{
			Role:    openai.User,
			Content: translateSentencePrompt(sentence, lang),
		},
	}
	return client.StreamChat(ctx, messages, openai.Gpt4)
}

func Translate(ctx context.Context, word, lang string) (string, error) {
	client, err := openai.FromEnv()
	if err != nil {
		return "", fmt.Errorf("failed to get client: %w", err)
	}
	if len(word) > wordLimit(word) {
		return "", fmt.Errorf("word is too long")
	}
	messages := []openai.ChatMessage{
		{
			Role:    openai.User,
			Content: translatePrompt(word, lang),
		},
	}
	resp, err := client.Chat(ctx, messages, openai.Gpt4)
	if err != nil {
		return "", fmt.Errorf("failed to get response: %w", err)
	}
	return resp, nil
}

func translatePrompt(word, lang string) string {
	return fmt.Sprintf("「%s」という単語を%sに翻訳して.返答の形式としては、略した単語のみにしてください.", word, lang)
}

func translateSentencePrompt(sentence, lang string) string {
	return fmt.Sprintf("以下の文章を%sに翻訳してください。返答の形式としては、略した文章のみにしてください.\ns", lang, sentence)
}

func sentenceLimit(text string) int {
	const DEFAULT_SENTENCE_LIMIT = 500
	if os.Getenv("SENTENCE_LIMIT") == "" {
		return DEFAULT_SENTENCE_LIMIT
	}
	limit, err := strconv.Atoi(os.Getenv("SENTENCE_LIMIT"))
	if err != nil {
		return DEFAULT_SENTENCE_LIMIT
	}
	return limit
}
func wordLimit(text string) int {
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
