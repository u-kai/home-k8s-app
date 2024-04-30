package pkg

import (
	"context"
	"ele/openai"
)

func ReviewSentenceStream(ctx context.Context, sentence string) (<-chan string, <-chan error) {
	client, err := openai.FromEnv()
	errStream := make(chan error, 1)
	if err != nil {
		errStream <- err
		close(errStream)
		return nil, errStream
	}

	messages := reviewMessages(sentence)
	return client.StreamChat(ctx, messages, openai.Gpt4)
}

func reviewMessages(sentence string) []openai.ChatMessage {
	systemPrompt := openai.ChatMessage{
		Role:    openai.System,
		Content: "貴方は英語の先生です。次に私が提出する英文について文法の正しさや自然さをチェックしてください。ちなみに私はあまり英語が得意ではありません。よろしくお願いします。",
	}
	userPrompt := openai.ChatMessage{
		Role:    openai.User,
		Content: sentence,
	}
	return []openai.ChatMessage{systemPrompt, userPrompt}
}
