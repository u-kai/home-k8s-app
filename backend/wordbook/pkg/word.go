package wordbook

import (
	"ele/user"
	"fmt"
)

type WordInfo struct {
	user.UserId `json:"userId"`
	Word        `json:"value"`
	Sentences   []Sentence `json:"sentences"`
	CreatedAt   int64      `json:"createdAt"`
	MissCount   `json:"missCount"`
	Remarks     `json:"remarks"`
}

type Word struct {
	Value         WordValue `json:"value"`
	Meaning       `json:"meaning"`
	Sentences     []Sentence `json:"sentences"`
	Pronunciation `json:"pronunciation"`
}

const WORD_MAX_LENGTH = 45

type WordValue string

func NewWordValue(value string) (WordValue, error) {
	if value == "" {
		return WordValue(""), ErrEmptyWord{}
	}
	if !containAlfabet(value) {
		return WordValue(""), ErrInvalidWord{}
	}
	if len(value) > WORD_MAX_LENGTH {
		return WordValue(""), NewTooManyWordLengthError(value)
	}
	return WordValue(value), nil
}
func (w WordValue) String() string {
	return string(w)
}

type ErrInvalidWord struct{}

func (e ErrInvalidWord) Error() string {
	return "word is not a English word"
}

type TooManyWordLengthError struct {
	Word string
}

func NewTooManyWordLengthError(word string) TooManyWordLengthError {
	return TooManyWordLengthError{Word: word}
}
func (e TooManyWordLengthError) Error() string {
	return fmt.Sprintf("word length is too many: %s...", e.Word[0:30])
}

// Meaning is always a Japanese word
type Meaning string

type ErrInvalidMeaning struct{}

func (e ErrInvalidMeaning) Error() string {
	return "meaning is not a Japanese word"
}

type ErrEmptyWord struct{}

func (e ErrEmptyWord) Error() string {
	return "word is empty"
}

func NewMeaning(value string) (Meaning, error) {
	if value == "" {
		return Meaning(""), ErrEmptyWord{}
	}
	if containAlfabet(value) {
		return Meaning(""), ErrInvalidMeaning{}
	}
	return Meaning(value), nil
}
func containAlfabet(value string) bool {
	for _, r := range value {
		if 'a' <= r && r <= 'z' || 'A' <= r && r <= 'Z' {
			return true
		}
	}
	return false
}

type Pronunciation string
type Remarks string
type MissCount int

type Sentence struct {
	Value         string `json:"value"`
	Meaning       `json:"meaning"`
	Pronunciation `json:"pronunciation"`
}
