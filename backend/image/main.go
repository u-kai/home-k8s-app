package main

import (
	"context"
	"ele/openai"
	"fmt"
)

func main() {
	client, _ := openai.FromEnv()

	messages := []openai.ChatMessage{
		{
			Role:    openai.User,
			Content: fmt.Sprintf("1行目に「%s」を使った例文を返答してください。2行目に1行目で作った例文の日本語翻訳を返答して下さい。それ以外の返答は一切不要です。", "apple"),
		},
	}
	chatResp, errStream := client.StreamChat(context.Background(), messages, openai.Gpt3Dot5Trubo)
loop:
	for {
		select {
		case err := <-errStream:
			fmt.Println(err.Error())
		case msg, ok := <-chatResp:
			if !ok {
				break loop
			}
			print(msg)
		}
	}
}
