package openai_test

import (
	"context"
	"ele/openai"
	"testing"
)

func TestChat(t *testing.T) {
	t.Run("Use GPT4Turbo", func(t *testing.T) {
		client, err := openai.FromEnv()
		if err != nil {
			t.Fatal(err)
		}
		messages := []openai.ChatMessage{
			{
				Role:    openai.User,
				Content: "Hello, how are you?",
			},
		}
		ctx := context.Background()
		messageStream, errStream := client.StreamChat(ctx, messages, openai.Gpt4Turbo)
		for {
			select {
			case message, ok := <-messageStream:
				if !ok {
					return
				}
				t.Log(message)
			case err, ok := <-errStream:
				if !ok {
					return
				}
				t.Error(err)
			}
		}

	})
	t.Run("Use GPT4o", func(t *testing.T) {
		client, err := openai.FromEnv()
		if err != nil {
			t.Fatal(err)
		}
		messages := []openai.ChatMessage{
			{
				Role:    openai.User,
				Content: "Hello, how are you?",
			},
		}
		ctx := context.Background()
		messageStream, errStream := client.StreamChat(ctx, messages, openai.Gpt4o)
		for {
			select {
			case message, ok := <-messageStream:
				if !ok {
					return
				}
				t.Log(message)
			case err, ok := <-errStream:
				if !ok {
					return
				}
				t.Error(err)
			}
		}

	})
}
