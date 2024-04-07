package openai

import (
	"bytes"
	"encoding/json"
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

func (c *Client) CreateImage(req DALLERequest) (*DALLEResponse, error) {
	b, err := c.request(req)
	if err != nil {
		return nil, err
	}

	var resp *DALLEResponse
	println(string(b))
	err = json.Unmarshal(b, &resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (c *Client) request(gptReq OpenAIRequest) ([]byte, error) {
	b := gptReq.ToJSON()
	url := gptReq.Url().String()
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(b))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}

func Chat(prompt string) (string, error) {
	gptKey := os.Getenv("OPENAI_API_KEY")
	if gptKey == "" {
		return "No API key", nil
	}
	client := &http.Client{}
	url := "https://api.openai.com/v1/chat/completions"
	b, err := json.Marshal(ChatRequest{
		Model: "gpt-3.5-turbo",
		Messages: []struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		}{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	})
	if err != nil {
		return "", err
	}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(b))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", gptKey))
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	var gptResp ChatResponse
	err = json.NewDecoder(resp.Body).Decode(&gptResp)
	if err != nil {
		return "", err
	}
	return gptResp.Choices[0].Message.Content, nil
}

func FromEnv() (*Client, error) {
	gptKey := os.Getenv("OPENAI_API_KEY")
	if gptKey == "" {
		return nil, errors.New("no API key")
	}
	return NewClient(gptKey), nil
}
func NewClient(apiKey string) *Client {
	return &Client{httpClient: &http.Client{}, apiKey: apiKey}
}

type OpenAIUrl string

func (u OpenAIUrl) String() string {
	return string(u)
}

const (
	ChatUrl  OpenAIUrl = "https://api.openai.com/v1/chat/completions"
	DALLEUrl OpenAIUrl = "https://api.openai.com/v1/images/generations"
)

type ImageSizeForDALLE2 int

const (
	_ ImageSizeForDALLE2 = iota
	ImageSize256x256
	ImageSize512x512
	ImageSize1024x1024
)

func (i ImageSizeForDALLE2) Size() string {
	switch i {
	case ImageSize256x256:
		return "256x256"
	case ImageSize512x512:
		return "512x512"
	case ImageSize1024x1024:
		return "1024x1024"
	default:
		return ""
	}
}

type ImageSizeForDALLE3 int

const (
	_ ImageSizeForDALLE3 = iota
	ImageSize3_1024x1024
	ImageSize3_1792_1024
	ImageSize3_1024_1792
)

func (i ImageSizeForDALLE3) Size() string {
	switch i {
	case ImageSize3_1024x1024:
		return "1024x1024"
	case ImageSize3_1792_1024:
		return "1792x1024"
	case ImageSize3_1024_1792:
		return "1024x1792"
	default:
		return ""
	}
}

type DALLEResponseFormat string

const (
	URL        DALLEResponseFormat = "url"
	Base64Json DALLEResponseFormat = "b64_json"
)

type DALLEModel string

const (
	DALLE2 DALLEModel = "dall-e-2"
	DALLE3 DALLEModel = "dall-e-3"
)

type OpenAIRequest interface {
	Url() OpenAIUrl
	ToJSON() []byte
}

type DALLERequest interface {
	OpenAIRequest
}

type DALLE2Request struct {
	size           ImageSizeForDALLE2
	prompt         string
	numImages      int
	responseFormat DALLEResponseFormat
}

func (req *DALLE2Request) Url() OpenAIUrl {
	return DALLEUrl
}

type DALLE2OptionFunc func(*DALLE2Request)

func WithSizeForDALLE2(size ImageSizeForDALLE2) DALLE2OptionFunc {
	return func(req *DALLE2Request) {
		req.size = size
	}
}

func WithNumImages(numImages int) DALLE2OptionFunc {
	return func(req *DALLE2Request) {
		req.numImages = numImages
	}
}
func WithResponseFormatForDALLE2(format DALLEResponseFormat) DALLE2OptionFunc {
	return func(req *DALLE2Request) {
		req.responseFormat = format
	}
}

func NewDALLE2Request(prompt string, opts ...DALLE2OptionFunc) *DALLE2Request {
	result := &DALLE2Request{
		prompt:         prompt,
		size:           ImageSize256x256,
		numImages:      1,
		responseFormat: URL,
	}

	for _, opt := range opts {
		opt(result)
	}

	return result
}

func (req *DALLE2Request) ToJSON() []byte {
	result, _ := json.Marshal(req)
	return result
}

func (req *DALLE2Request) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Prompt         string `json:"prompt"`
		Model          string `json:"model"`
		N              int    `json:"n"`
		Size           string `json:"size"`
		ResponseFormat string `json:"response_format"`
	}{
		Prompt:         req.prompt,
		Model:          string(DALLE2),
		N:              req.numImages,
		Size:           req.size.Size(),
		ResponseFormat: string(req.responseFormat),
	})
}

type DALLEQuality string

const (
	Standard DALLEQuality = "standard"
	HD       DALLEQuality = "hd"
)

type DALLEStyle string

const (
	Vivid   DALLEStyle = "vivid"
	natural DALLEStyle = "natural"
)

type DALLE3Request struct {
	quality        DALLEQuality
	responseFormat DALLEResponseFormat
	prompt         string
	size           ImageSizeForDALLE3
	style          DALLEStyle
}

func (req *DALLE3Request) Url() OpenAIUrl {
	return DALLEUrl
}

type DALLE3OptionFunc func(*DALLE3Request)

func WithQuality(quality DALLEQuality) DALLE3OptionFunc {
	return func(req *DALLE3Request) {
		req.quality = quality
	}
}
func WithResponseFormat(format DALLEResponseFormat) DALLE3OptionFunc {
	return func(req *DALLE3Request) {
		req.responseFormat = format
	}
}
func WithSize(size ImageSizeForDALLE3) DALLE3OptionFunc {
	return func(req *DALLE3Request) {
		req.size = size
	}
}
func WithStyle(style DALLEStyle) DALLE3OptionFunc {
	return func(req *DALLE3Request) {
		req.style = style
	}
}

func NewDALLE3Request(prompt string, opts ...DALLE3OptionFunc) *DALLE3Request {
	result := &DALLE3Request{
		prompt:         prompt,
		quality:        Standard,
		responseFormat: URL,
		size:           ImageSize3_1024x1024,
		style:          natural,
	}

	for _, opt := range opts {
		opt(result)
	}

	return result
}

func (req *DALLE3Request) ToJSON() []byte {
	result, _ := json.Marshal(req)
	return result
}

func (req *DALLE3Request) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Prompt         string `json:"prompt"`
		Model          string `json:"model"`
		N              int    `json:"n"`
		Quality        string `json:"quality"`
		ResponseFormat string `json:"response_format"`
		Size           string `json:"size"`
		Style          string `json:"style"`
	}{
		Prompt:         req.prompt,
		Model:          string(DALLE3),
		N:              1,
		Quality:        string(req.quality),
		ResponseFormat: string(req.responseFormat),
		Size:           req.size.Size(),
		Style:          string(req.style),
	})
}

type DALLEResponse struct {
	Created int64 `json:"created"`
	Data    []struct {
		Url     string `json:"url"`
		B64Json string `json:"b64_json"`
	} `json:"data"`
}
type ChatRequest struct {
	Model    string `json:"model"`
	Messages []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
}

type ChatResponse struct {
	Choices []struct {
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}
