package wordbook

import (
	"ele/common"
	"fmt"
)

type WordId string

func NewWordId() func() WordId {
	return func() WordId {
		return WordId(common.NewID().String())
	}
}

type WordValue string

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

func NewWordValue(value string) (WordValue, error) {
	const MAX_LENGTH = 45
	if value == "" {
		return WordValue(""), ErrEmptyWord{}
	}
	if !containAlfabet(value) {
		return WordValue(""), ErrInvalidWord{}
	}
	if len(value) > MAX_LENGTH {
		return WordValue(""), NewTooManyWordLengthError(value)
	}
	return WordValue(value), nil
}
func (w WordValue) String() string {
	return string(w)
}

type ErrEmptyWord struct{}

func (e ErrEmptyWord) Error() string {
	return "word is empty"
}

// Meaning is always a Japanese word
type Meaning string

type ErrInvalidMeaning struct{}

func (e ErrInvalidMeaning) Error() string {
	return "meaning is not a Japanese word"
}

type TooManyMeaningLengthError struct {
	Meaning string
}

func NewTooManyMeaningLengthError(word string) TooManyMeaningLengthError {
	return TooManyMeaningLengthError{Meaning: word}
}
func (e TooManyMeaningLengthError) Error() string {
	return fmt.Sprintf("meaning length is too many: %s...", e.Meaning[0:30])
}

func NewMeaning(value string) (Meaning, error) {
	const MAX_LENGTH = 500
	if value == "" {
		return Meaning(""), ErrEmptyWord{}
	}
	if containAlfabet(value) {
		return Meaning(""), ErrInvalidMeaning{}
	}
	if len(value) > MAX_LENGTH {
		return Meaning(""), NewTooManyMeaningLengthError(value)
	}
	return Meaning(value), nil
}

func containAlfabet(value string) bool {
	for _, r := range value {
		if charIsAlfabet(r) {
			return true
		}
	}
	return false
}

func allEn(value string) bool {
	for _, r := range value {
		if !charIsEn(r) {
			return false
		}
	}
	return true
}

func charIsEn(r rune) bool {
	return byte(r) < 128
}
func charIsAlfabet(r rune) bool {
	return 'a' <= r && r <= 'z' || 'A' <= r && r <= 'Z'
}

// Pronunciation is always a Japanese word and optional
type Pronunciation string
type ErrInvalidPronunication struct{}

func NewPronunication(value string) (Pronunciation, error) {
	const MAX_LENGTH = 100
	if containAlfabet(value) {
		return Pronunciation(""), ErrInvalidPronunication{}
	}
	if len(value) > MAX_LENGTH {
		return Pronunciation(""), NewTooManyWordLengthError(value)
	}
	return Pronunciation(value), nil
}

func (e ErrInvalidPronunication) Error() string {
	return "pronunication is not a Japanese word"
}

type Remarks string

func NewRemarks(value string) (Remarks, error) {
	const MAX_LENGTH = 150
	if len(value) > MAX_LENGTH {
		return Remarks(""), NewTooManyWordLengthError(value)
	}
	return Remarks(value), nil
}

type MissCount int

func NewMissCount() MissCount {
	return 0
}

type LikeRates string

const (
	VeryGood LikeRates = "veryGood"
	Good     LikeRates = "good"
	Normal   LikeRates = "normal"
	Bad      LikeRates = "bad"
	VeryBad  LikeRates = "veryBad"
)

func NewLikeRates(value string) (LikeRates, error) {
	switch value {
	case "veryGood":
		return VeryGood, nil
	case "good":
		return Good, nil
	case "normal":
		return Normal, nil
	case "bad":
		return Bad, nil
	case "veryBad":
		return VeryBad, nil
	default:
		return LikeRates(""), ErrInvalidLikeRates{}
	}
}

func DefaultLikeRates() LikeRates {
	return Normal
}

type ErrInvalidLikeRates struct{}

func (e ErrInvalidLikeRates) Error() string {
	return "like rates is invalid"
}

type Word struct {
	Value         WordValue `json:"value"`
	Meaning       `json:"meaning"`
	Pronunciation `json:"pronunciation"`
}

func NewWord(value WordValue, meaning Meaning, pronunciation Pronunciation) Word {
	return Word{
		Value:         value,
		Meaning:       meaning,
		Pronunciation: pronunciation,
	}
}

type SentenceValue string

type ErrInvalidSentence struct {
	Invalid string
}

func (e ErrInvalidSentence) Error() string {
	return fmt.Sprintf("sentence is not a English sentence: %s", e.Invalid)
}

type TooManySentenceLengthError struct {
	Sentence string
}

func NewTooManySentenceLengthError(word string) TooManySentenceLengthError {
	return TooManySentenceLengthError{Sentence: word}
}
func (e TooManySentenceLengthError) Error() string {
	return fmt.Sprintf("sentence length is too many: %s...", e.Sentence[0:30])
}

const MAX_SENTENCE_LENGTH = 3000

func NewSentenceValue(value string) (SentenceValue, error) {
	if value == "" {
		return SentenceValue(""), ErrEmptyWord{}
	}
	if !containAlfabet(value) {
		return SentenceValue(""), ErrInvalidSentence{Invalid: value}
	}
	if len(value) > MAX_SENTENCE_LENGTH {
		return SentenceValue(""), NewTooManyWordLengthError(value)
	}
	return SentenceValue(value), nil
}

type Sentence struct {
	Value         SentenceValue   `json:"value"`
	Meaning       SentenceMeaning `json:"meaning"`
	Pronunciation `json:"pronunciation"`
}

type SentenceMeaning string

func NewSentenceMeaning(value string) (SentenceMeaning, error) {
	if value == "" {
		return SentenceMeaning(""), ErrEmptyWord{}
	}
	if allEn(value) {
		return SentenceMeaning(""), ErrInvalidSentence{Invalid: value}
	}
	if len(value) > MAX_SENTENCE_LENGTH {
		return SentenceMeaning(""), NewTooManyMeaningLengthError(value)
	}
	return SentenceMeaning(value), nil
}

type SentenceId string

func NewSentenceId() func() SentenceId {
	return func() SentenceId {
		return SentenceId(common.NewID().String())
	}
}

type SentenceProfile struct {
	SentenceId `json:"sentenceId"`
	Sentence   `json:"sentence"`
	CreatedAt  int64 `json:"createdAt"`
	UpdatedAt  int64 `json:"updatedAt"`
}

func newSentenceProfile(sentence Sentence, newId func() SentenceId, now common.NowFunc) SentenceProfile {
	return SentenceProfile{
		SentenceId: newId(),
		Sentence:   sentence,
		CreatedAt:  now(),
		UpdatedAt:  now(),
	}
}

func updateSentenceProfile(old SentenceProfile, new Sentence, now common.NowFunc) SentenceProfile {
	old.Sentence = new
	old.UpdatedAt = now()
	return old
}

type WordProfile struct {
	WordId    WordId `json:"wordId"`
	Word      `json:"word"`
	MissCount `json:"missCount"`
	Remarks   `json:"remarks"`
	LikeRates `json:"likeRates"`
	CreatedAt int64             `json:"createdAt"`
	UpdatedAt int64             `json:"updatedAt"`
	Sentences []SentenceProfile `json:"sentences"`
}

func NewWordProfile(
	word Word,
	newId func() WordId,
	now common.NowFunc,
	sentences []SentenceProfile,
	remarks Remarks,
) WordProfile {
	return WordProfile{
		WordId:    newId(),
		Word:      word,
		CreatedAt: now(),
		UpdatedAt: now(),
		Sentences: sentences,
		MissCount: NewMissCount(),
		Remarks:   remarks,
		LikeRates: DefaultLikeRates(),
	}
}

type UpdatedSentencesProfile struct {
	Updates []SentenceProfile
	News    []NewSentence
}

func (req UpdatedSentencesProfile) len() int {
	return len(req.Updates) + len(req.News)
}

type NewSentence struct {
	Value   SentenceValue
	Meaning SentenceMeaning
	Pronunciation
}

func (n NewSentence) toSentenceProfile(newId func() SentenceId, now common.NowFunc) SentenceProfile {
	return newSentenceProfile(Sentence(n), newId, now)
}

func updateSentences(olds []SentenceProfile, new UpdatedSentencesProfile, newId func() SentenceId, now common.NowFunc) []SentenceProfile {
	result := make([]SentenceProfile, 0, new.len())
	for _, o := range olds {
		for _, u := range new.Updates {
			if o.SentenceId == u.SentenceId {
				updated := updateSentenceProfile(o, u.Sentence, now)
				result = append(result, updated)
			}
		}
	}
	for _, n := range new.News {
		result = append(result, n.toSentenceProfile(newId, now))
	}
	return result
}

type UpdatedWordProfile struct {
	Word
	MissCount
	Remarks
	LikeRates
	Sentences UpdatedSentencesProfile
}

func (old WordProfile) NewProfile(new UpdatedWordProfile, newId func() SentenceId, now common.NowFunc) WordProfile {
	old.Word = new.Word
	old.MissCount = new.MissCount
	old.Remarks = new.Remarks
	old.LikeRates = new.LikeRates
	old.UpdatedAt = now()
	old.Sentences = updateSentences(old.Sentences, new.Sentences, newId, now)
	return old
}
