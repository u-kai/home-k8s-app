package wordbook_test

import (
	wordbook "ele/wordbook/pkg"
	"reflect"
	"strings"
	"testing"
)

func TestUpdateWordProfile(t *testing.T) {
	fakeWordId := func() wordbook.WordId {
		return wordbook.WordId("fakeWordId")
	}
	fakeSentenceId := func() wordbook.SentenceId {
		return wordbook.SentenceId("fakeSentenceId")
	}
	fakeNowOld := func() int64 {
		return int64(1000)
	}
	fakeNowNew := func() int64 {
		return int64(2000)
	}
	word := wordbook.NewWord(
		wordbook.WordValue("word"),
		wordbook.Meaning("meaning"),
		wordbook.Pronunciation("pronunciation"),
	)
	missCount := wordbook.MissCount(0)
	remarks := wordbook.Remarks("remarks")
	likeRates := wordbook.DefaultLikeRates()
	for _, tt := range []struct {
		name      string
		old       wordbook.WordProfile
		updateReq wordbook.UpdatedWordProfile
		expected  wordbook.WordProfile
	}{
		{
			"add sentences from empty",
			wordbook.WordProfile{
				WordId:    fakeWordId(),
				Word:      word,
				MissCount: missCount,
				Remarks:   remarks,
				LikeRates: likeRates,
				CreatedAt: fakeNowOld(),
				UpdatedAt: fakeNowOld(),
				Sentences: []wordbook.SentenceProfile{},
			},
			wordbook.UpdatedWordProfile{
				Word:      word,
				Remarks:   remarks,
				LikeRates: likeRates,
				Sentences: wordbook.UpdatedSentencesProfile{
					News: []wordbook.NewSentence{
						{
							Value:         wordbook.SentenceValue("sentence"),
							Meaning:       wordbook.Meaning("meaning"),
							Pronunciation: wordbook.Pronunciation("pronunciation"),
						},
					},
				},
			},
			wordbook.WordProfile{
				WordId:    fakeWordId(),
				Word:      word,
				MissCount: missCount,
				Remarks:   remarks,
				LikeRates: likeRates,
				CreatedAt: fakeNowOld(),
				UpdatedAt: fakeNowNew(),
				Sentences: []wordbook.SentenceProfile{
					{
						SentenceId: fakeSentenceId(),
						Sentence: wordbook.Sentence{
							Value:         wordbook.SentenceValue("sentence"),
							Meaning:       wordbook.Meaning("meaning"),
							Pronunciation: wordbook.Pronunciation("pronunciation"),
						},
						CreatedAt: fakeNowNew(),
						UpdatedAt: fakeNowNew(),
					},
				},
			},
		},
	} {
		t.Run(tt.name, func(t *testing.T) {
			got := tt.old.NewProfile(tt.updateReq, fakeSentenceId, fakeNowNew)
			if !reflect.DeepEqual(tt.expected, got) {
				t.Errorf("expected %v, got %v", tt.expected, got)
			}
		})
	}
}

func TestWord(t *testing.T) {
	for _, tt := range []struct {
		name           string
		input          string
		expectedString string
		expectedErr    error
	}{
		{"invalid case word is not en", "私", "", wordbook.ErrInvalidWord{}},
		{"invalid case word containe byte char other than alfabet", "私123", "", wordbook.ErrInvalidWord{}},
		{"valid case word is en", "i", "i", nil},
		{"valid case word containe some word", "i am fine", "i am fine", nil},
		{"invalid case word len too many", strings.Repeat("i", 10000), "", wordbook.NewTooManyWordLengthError(strings.Repeat("i", 10000))},
		{"invalid case empty", "", "", wordbook.ErrEmptyWord{}},
	} {
		t.Run(tt.name, func(t *testing.T) {
			word, err := wordbook.NewWordValue(tt.input)
			if err != tt.expectedErr {
				t.Errorf("expected %v, got %v", tt.expectedErr, err)
			}
			if word.String() != tt.expectedString {
				t.Errorf("expected %v, got %v", tt.expectedString, word)
			}
		})
	}
}

func TestMeaning(t *testing.T) {
	for _, tt := range []struct {
		name        string
		input       string
		expected    wordbook.Meaning
		expectedErr error
	}{
		{"valid case meaning is not en", "私は元気です", wordbook.Meaning("私は元気です"), nil},
		{"valid case meaning containe byte char other than alfabet", "私は元気です!.123", wordbook.Meaning("私は元気です!.123"), nil},
		{"invalid case meaning is en", "i'm fine", wordbook.Meaning(""), wordbook.ErrInvalidMeaning{}},
		{"invalid case containe en", "私は元気ですi'm fine", wordbook.Meaning(""), wordbook.ErrInvalidMeaning{}},
		{"empty", "", wordbook.Meaning(""), wordbook.ErrEmptyWord{}},
	} {
		t.Run(tt.name, func(t *testing.T) {
			meaning, err := wordbook.NewMeaning(tt.input)
			if err != tt.expectedErr {
				t.Errorf("expected %v, got %v", tt.expectedErr, err)
			}
			if meaning != tt.expected {
				t.Errorf("expected %v, got %v", tt.expected, meaning)
			}
		})
	}
}
