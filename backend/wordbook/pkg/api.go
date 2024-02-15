package wordbook

import "ele/user"

type UpdateWordProfileApiSchema struct {
	UserId        string                           `json:"userId"`
	Word          string                           `json:"word"`
	WordId        string                           `json:"wordId"`
	Meaning       string                           `json:"meaning"`
	Pronunciation string                           `json:"pronunciation"`
	Remarks       string                           `json:"remarks"`
	MissCount     int                              `json:"missCount"`
	LikeRates     string                           `json:"likeRates"`
	Sentences     []updateSentenceProfileApiSchema `json:"sentences"`
}

func (s UpdateWordProfileApiSchema) ToUpdatedWordProfileSource() (UpdatedWordProfileSource, error) {
	value, err := NewWordValue(s.Word)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	meaning, err := NewMeaning(s.Meaning)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	pronunciation, err := NewPronunication(s.Pronunciation)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	word := NewWord(value, meaning, pronunciation)
	remarks, err := NewRemarks(s.Remarks)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	missCount := MissCount(s.MissCount)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	likeRates, err := NewLikeRates(s.LikeRates)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	sentences, err := toUpdatedSentenceProfileSource(s.Sentences)
	if err != nil {
		return UpdatedWordProfileSource{}, err
	}
	return UpdatedWordProfileSource{
		WordId: WordId(s.WordId),
		Profile: UpdatedWordProfile{
			Word:      word,
			Remarks:   remarks,
			MissCount: missCount,
			LikeRates: likeRates,
			Sentences: sentences,
		},
	}, nil
}

type updateSentenceProfileApiSchema struct {
	SentenceId    string `json:"sentenceId"`
	Value         string `json:"value"`
	Meaning       string `json:"meaning"`
	Pronunciation string `json:"pronunciation"`
}

func toUpdatedSentenceProfileSource(sentences []updateSentenceProfileApiSchema) (UpdatedSentencesProfile, error) {
	updates := []SentenceProfile{}
	news := []NewSentence{}
	for _, sentence := range sentences {
		if sentence.SentenceId != "" {
			sentenceId := SentenceId(sentence.SentenceId)
			value, err := NewSentenceValue(sentence.Value)
			if err != nil {
				return UpdatedSentencesProfile{}, err
			}
			meaning, err := NewMeaning(sentence.Meaning)
			if err != nil {
				return UpdatedSentencesProfile{}, err
			}
			pronunciation, err := NewPronunication(sentence.Pronunciation)
			if err != nil {
				return UpdatedSentencesProfile{}, err
			}
			sentence := Sentence{
				Value:         value,
				Meaning:       meaning,
				Pronunciation: pronunciation,
			}
			updates = append(updates, SentenceProfile{
				SentenceId: sentenceId,
				Sentence:   sentence,
			})
			continue
		}
		value, err := NewSentenceValue(sentence.Value)
		if err != nil {
			return UpdatedSentencesProfile{}, err
		}
		meaning, err := NewMeaning(sentence.Meaning)
		if err != nil {
			return UpdatedSentencesProfile{}, err
		}
		pronunciation, err := NewPronunication(sentence.Pronunciation)
		if err != nil {
			return UpdatedSentencesProfile{}, err
		}
		news = append(news, NewSentence{
			Value:         value,
			Meaning:       meaning,
			Pronunciation: pronunciation,
		})
	}
	return UpdatedSentencesProfile{
		Updates: updates,
		News:    news,
	}, nil
}

type RegisterWordProfileApiSchema struct {
	UserId        string                             `json:"userId"`
	Word          string                             `json:"word"`
	Meaning       string                             `json:"meaning"`
	Pronunciation string                             `json:"pronunciation"`
	Remarks       string                             `json:"remarks"`
	Sentences     []registerSentenceProfileApiSchema `json:"sentences"`
}

type registerSentenceProfileApiSchema struct {
	Value         string `json:"value"`
	Meaning       string `json:"meaning"`
	Pronunciation string `json:"pronunciation"`
}

func (s RegisterWordProfileApiSchema) ToRegisterWordProfileSource() (RegisterWordProfileSource, error) {
	sentences := make([]Sentence, 0, len(s.Sentences))
	for _, sentence := range s.Sentences {
		value, err := NewSentenceValue(sentence.Value)
		if err != nil {
			return RegisterWordProfileSource{}, err
		}
		meaning, err := NewMeaning(sentence.Meaning)
		if err != nil {
			return RegisterWordProfileSource{}, err
		}
		pronunciation, err := NewPronunication(sentence.Pronunciation)
		if err != nil {
			return RegisterWordProfileSource{}, err
		}
		sentences = append(sentences, Sentence{
			Value:         value,
			Meaning:       meaning,
			Pronunciation: pronunciation,
		})
	}
	value, err := NewWordValue(s.Word)
	if err != nil {
		return RegisterWordProfileSource{}, err
	}
	meaning, err := NewMeaning(s.Meaning)
	if err != nil {
		return RegisterWordProfileSource{}, err
	}
	pronunciation, err := NewPronunication(s.Pronunciation)
	if err != nil {
		return RegisterWordProfileSource{}, err
	}
	word := NewWord(value, meaning, pronunciation)
	remarks, err := NewRemarks(s.Remarks)
	if err != nil {
		return RegisterWordProfileSource{}, err
	}
	userId := user.UserId(s.UserId)
	return RegisterWordProfileSource{
		UserId:    userId,
		Word:      word,
		Sentences: sentences,
		Remarks:   remarks,
	}, nil
}

type DeleteWordProfileApiSchema struct {
	UserId string `json:"userId"`
	WordId string `json:"wordId"`
}

func (s DeleteWordProfileApiSchema) ToDeleteWordProfileSource() (DeletedWordProfileSource, error) {
	return DeletedWordProfileSource{
		WordId: WordId(s.WordId),
	}, nil
}
