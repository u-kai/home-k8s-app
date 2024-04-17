package main

import (
	"ele/openai"
	"fmt"
)

func main() {
	client, _ := openai.FromEnv()

	req := openai.NewDALLE2Request("I felt embarrassed when I tripped in front of everyone.")
	resp, err := client.CreateImage(req)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Image URL: %v\n", resp.Data[0].Url)
}
