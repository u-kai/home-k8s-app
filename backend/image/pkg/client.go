package pkg

import (
	"context"
	"ele/openai"
	"fmt"
)

type Image struct {
	size ImageSize
	data Base64ImageData
}

type ImageSize struct {
	height int
	width  int
}

type Base64ImageData string

type GenerateImageRequest struct {
	prompt Prompt
	size   ImageSize
}

type Prompt string

const PREFIX_PROMPT = "画像はゆるいアニメ風でお願いします"

func NewPromptFromSentence(sentence string) Prompt {
	return Prompt(fmt.Sprintf("以下の文章を表す画像を生成してください。文章が記憶に定着するようなものが望ましいです。%s\n\n %s", PREFIX_PROMPT, sentence))
}

type GenerateImage func(context.Context, GenerateImageRequest) (Image, error)

func GenerateImageFromDALLE(ctx context.Context, req GenerateImageRequest) (Image, error) {
	client, err := openai.FromEnv()
	if err != nil {
		return Image{}, err
	}

	createImageReq := new(openai.DALLE3Request)
	client.CreateImage(createImageReq)
	return Image{}, nil
}

type ImageUrl string

type ImageRepository func(context.Context, Image) (ImageUrl, error)

type ImageRefRepository func(context.Context, Image) error
