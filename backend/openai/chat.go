package openai

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
)

type chatStreamLine string

func newChatStreamLine(line string) chatStreamLine {
	return chatStreamLine(line)
}

func (c *chatStreamLine) isDone() bool {
	// [DONE] is the last line of the gpt chat stream
	if len(*c) < 6 {
		return false
	}
	return string(*c)[6:] == "[DONE]"
}

func (c *chatStreamLine) toContent() (string, error) {
	var chatStream ChatStreamResponse
	if len(*c) < 6 {
		return "", nil
	}
	err := json.Unmarshal([]byte((*c)[6:]), &chatStream)
	if err != nil {
		return "", err
	}
	return chatStream.Choices[0].Delta.Content, nil
}

func (c *Client) Chat(ctx context.Context, messages []ChatMessage, model ChatGPTModel) (string, error) {
	chatReq := &ChatRequest{
		Model:    model,
		Messages: messages,
		Stream:   false,
	}
	resp, err := c.request(chatReq)
	if err != nil {
		return "", err
	}
	var chatResp ChatResponse
	err = json.Unmarshal(resp, &chatResp)
	if err != nil {
		return "", err
	}
	if len(chatResp.Choices) == 0 {
		return "", nil
	}
	last := len(chatResp.Choices) - 1
	return chatResp.Choices[last].Message.Content, nil
}

func (c *Client) StreamChat(ctx context.Context, messages []ChatMessage, model ChatGPTModel) (<-chan string, <-chan error) {
	out := make(chan string)
	errStream := make(chan error, 1)
	chatReq := &ChatRequest{
		Model:    model,
		Messages: messages,
		Stream:   true,
	}
	req, err := c.createRequest(chatReq)
	if err != nil {
		errStream <- fmt.Errorf("failed to create StreamChat request: %w", err)
		close(out)
		close(errStream)
		return out, errStream
	}
	req.Header.Set("Accept", "text/event-stream")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		errStream <- fmt.Errorf("failed to do StreamChat request: %w", err)
		close(out)
		close(errStream)
		return out, errStream
	}
	scanner := bufio.NewScanner(resp.Body)

	go func() {
		defer func() {
			resp.Body.Close()
			close(out)
			close(errStream)
		}()
		for {
			select {
			case <-ctx.Done():
				if ctx.Err() != nil {
					errStream <- fmt.Errorf("context error: %w", ctx.Err())
				}
				return
			default:
				if err := scanner.Err(); err != nil {
					errStream <- err
					return
				}
				for scanner.Scan() {
					line := scanner.Text()
					chatLine := newChatStreamLine(line)
					if chatLine.isDone() {
						return
					}
					content, err := chatLine.toContent()
					if err != nil {
						errStream <- fmt.Errorf("failed to parse chat stream line: %w", err)
						return
					}
					out <- content
				}
			}
		}
	}()
	return out, errStream
}

type ChatGPTModel string

const (
	Gpt4o         ChatGPTModel = "gpt-4o"
	Gpt4Turbo     ChatGPTModel = "gpt-4-turbo"
	Gpt4          ChatGPTModel = "gpt-4"
	Gpt3Dot5Turbo ChatGPTModel = "gpt-3.5-turbo"
)

type ChatStreamResponse struct {
	Choices           []ChatChoices `json:"choices"`
	Created           int           `json:"created"`
	Id                string        `json:"id"`
	Model             string        `json:"model"`
	Object            string        `json:"object"`
	SystemFingerprint string        `json:"system_fingerprint"`
}

type ChatChoices struct {
	Delta        ChatChoicesDelta `json:"delta"`
	FinishReason any              `json:"finish_reason"`
	Index        int              `json:"index"`
	Logprobs     any              `json:"logprobs"`
}
type ChatChoicesDelta struct {
	Content string `json:"content"`
}

type ChatRequest struct {
	Model    ChatGPTModel  `json:"model"`
	Messages []ChatMessage `json:"messages"`
	Stream   bool          `json:"stream"`
}

type Role string

const (
	User      Role = "user"
	System    Role = "system"
	Assistant Role = "assistant"
)

type ChatMessage struct {
	Role    Role   `json:"role"`
	Content string `json:"content"`
}

func (req *ChatRequest) Url() OpenAIUrl {
	return ChatUrl
}

func (req *ChatRequest) ToJSON() []byte {
	result, _ := json.Marshal(req)
	return result
}

type ChatResponse struct {
	Choices []struct {
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}
