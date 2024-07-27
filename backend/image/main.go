package main

import (
	"ele/common"
	//"ele/openai"
	//"fmt"
	//"net/http"
)

func main() {
	//client, _ := openai.FromEnv()

	server := common.DefaultELEServer("")
	server.Start()
	///var handler common.PostSSEHandler[]
	//handler = func(w http.ResponseWriter, r *http.Request) (<-chan string, <-chan error) {
	//	message := r.URL.Query().Get("message")
	//	messages := []openai.ChatMessage{
	//		{
	//			Role:    openai.User,
	//			Content: fmt.Sprintf("1行目に「%s」を使った例文を返答してください。2行目に1行目で作った例文の日本語翻訳を返答して下さい。それ以外の返答は一切不要です。", message),
	//		},
	//	}
	//	chatResp, errStream := client.StreamChat(r.Context(), messages, openai.Gpt3Dot5Turbo)
	//	return chatResp, errStream
	//}

	//sse := common.NewSSEHandler(handler)
	//server.RegisterHandler("chat", sse)
	//server.Start()
}
