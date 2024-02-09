package wordbook

import (
	"ele/common"
	"ele/user"
	"fmt"
)

type UpdateWordRequest struct {
	UserId        user.UserId `json:"userId"`
	WordId        WordId      `json:"wordId"`
	Meaning       string      `json:"meaning"`
	Pronunciation string      `json:"pronunciation"`
	Remarks       string      `json:"remarks"`
	CreatedAt     int64       `json:"createdAt"`
	Sentences     []struct {
		Value         string `json:"value"`
		Meaning       string `json:"meaning"`
		Pronunciation string `json:"pronunciation"`
	} `json:"sentences"`
}

func UpdateWord(userId user.UserId, req UpdateWordRequest) (WordInfo, error) {
	return WordInfo{
		UserId:    user.UserId(userId),
		CreatedAt: req.CreatedAt,
		UpdatedAt: common.Now(),
		WordId:    req.WordId,
		MissCount: 0,
		Remarks:   Remarks(req.Remarks),
		LikeRates: DefaultLikeRates(),
	}, nil
}

func DeleteWord(userId user.UserId, wordId WordId) error {
	return nil
}

type RegisterWordRequest struct {
	UserId        user.UserId `json:"userId"`
	Word          string      `json:"word"`
	Meaning       string      `json:"meaning"`
	Pronunciation string      `json:"pronunciation"`
	Remarks       string      `json:"remarks"`
	Sentences     []struct {
		Value         string `json:"value"`
		Meaning       string `json:"meaning"`
		Pronunciation string `json:"pronunciation"`
	} `json:"sentences"`
}

func RegsiterWord(userId user.UserId, req RegisterWordRequest) (WordInfo, error) {
	sentences := make([]Sentence, len(req.Sentences))
	for i, s := range req.Sentences {
		sentences[i] = Sentence{
			Value:   s.Value,
			Meaning: Meaning(s.Meaning),
		}
	}
	return WordInfo{
		UserId:    user.UserId(userId),
		CreatedAt: common.Now(),
		UpdatedAt: common.Now(),
		WordId:    NewWordId(),
		MissCount: 0,
		Remarks:   Remarks(req.Remarks),
		LikeRates: DefaultLikeRates(),
		Word: Word{
			Value:         WordValue(req.Word),
			Meaning:       Meaning(req.Meaning),
			Sentences:     sentences,
			Pronunciation: Pronunciation(req.Pronunciation),
		},
	}, nil
}

func FetchWordInfo(userId user.UserId) ([]WordInfo, error) {
	result := []WordInfo{}
	for _, word := range []string{"apple", "banana", "cherry"} {
		result = append(result, WordInfo{
			UserId:    user.UserId(userId),
			CreatedAt: common.Now(),
			UpdatedAt: common.Now(),
			MissCount: 0,
			Remarks:   "This is a Remarks",
			LikeRates: DefaultLikeRates(),
			WordId:    NewWordId(),
			Word: Word{
				Value:   WordValue(fmt.Sprintf("This is a %s", word)),
				Meaning: Meaning("これは単語です"),
				Sentences: []Sentence{
					{
						Value:   "This is a fetch sentence",
						Meaning: "これは文です",
					},
				},
				Pronunciation: Pronunciation("ディス イズ ア ワード"),
			},
		})
	}
	return result, nil
}
