package pkg

import (
	"context"
	"ele/openai"
)

func ReviewSentenceStream(ctx context.Context, sentence string, model openai.ChatGPTModel) (<-chan string, <-chan error) {
	client, err := openai.FromEnv()
	errStream := make(chan error, 1)
	if err != nil {
		errStream <- err
		close(errStream)
		return nil, errStream
	}

	messages := reviewMessages(sentence)
	return client.StreamChat(ctx, messages, model)
}

func reviewMessages(sentence string) []openai.ChatMessage {
	systemPrompt := openai.ChatMessage{
		Role:    openai.System,
		Content: "貴方は英語の先生です。次に私が提出する文章が英語であれば、文法の正しさや自然さをチェックしてください。日本語であれば英語に直して、解説をしてください。",
	}
	userPrompt := openai.ChatMessage{
		Role:    openai.User,
		Content: sentence,
	}
	return []openai.ChatMessage{systemPrompt, userPrompt}
}
