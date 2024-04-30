package openai

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Client struct {
	apiKey     string
	httpClient *http.Client
}

func NewClient(apiKey string) *Client {
	return &Client{httpClient: &http.Client{}, apiKey: apiKey}
}

func FromEnv() (*Client, error) {
	gptKey := os.Getenv("OPENAI_API_KEY")
	if gptKey == "" {
		return nil, errors.New("no API key")
	}
	return NewClient(gptKey), nil
}

func (c *Client) createRequest(gptReq OpenAIRequest) (*http.Request, error) {
	b := gptReq.ToJSON()
	url := gptReq.Url().String()
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(b))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
	return req, nil
}

func (c *Client) request(gptReq OpenAIRequest) ([]byte, error) {
	req, err := c.createRequest(gptReq)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}

type OpenAIUrl string

const (
	ChatUrl  OpenAIUrl = "https://api.openai.com/v1/chat/completions"
	DALLEUrl OpenAIUrl = "https://api.openai.com/v1/images/generations"
)

func (u OpenAIUrl) String() string {
	return string(u)
}

type OpenAIRequest interface {
	Url() OpenAIUrl
	ToJSON() []byte
}
