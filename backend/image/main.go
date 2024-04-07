package main

import (
	"ele/openai"
	"fmt"
)

func main() {
	client, _ := openai.FromEnv()
	req := openai.NewDALLE2Request("I received a great testimonial from a satisfied customer.")
	resp, err := client.CreateImage(req)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Image URL: %v\n", resp)
}
