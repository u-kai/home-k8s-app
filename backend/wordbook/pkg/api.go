package wordbook

import (
	"context"
	"ele/common"
	"ele/user"
	"encoding/json"
	"net/http"

	"go.opentelemetry.io/otel/trace"
)

type FetchWordProfileResponse struct {
	Result []WordProfile `json:"result"`
}

func (f FetchWordProfileResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Result []WordProfile `json:"result"`
	}{
		Result: f.Result,
	})
}

func FetchWordProfileHandler(c context.Context, tracer trace.Tracer) http.HandlerFunc {
	return common.CreateGetHandlerWithIDToken(func(ctx context.Context, query common.Query, idToken common.IDToken) (FetchWordProfileResponse, error) {
		db, err := common.FromEnv().Open()
		if err != nil {
			return FetchWordProfileResponse{}, err
		}
		defer db.Close()
		userId := user.UserIdFromIDToken(idToken)
		ctx, span := tracer.Start(ctx, "FetchWordProfileHandler")
		defer span.End()
		wordProfile, err := FetchWordProfileFromDBByUserId(ctx, tracer, db, userId)
		if err != nil {
			return FetchWordProfileResponse{}, err
		}
		return FetchWordProfileResponse{
			Result: wordProfile,
		}, nil
	})
}

type UpdateWordProfileApiSchema struct {
	Word          string                           `json:"word"`
	WordId        string                           `json:"wordId"`
	Meaning       string                           `json:"meaning"`
	Pronunciation string                           `json:"pronunciation"`
	Remarks       string                           `json:"remarks"`
	MissCount     int                              `json:"missCount"`
	LikeRates     string                           `json:"likeRates"`
	Sentences     []updateSentenceProfileApiSchema `json:"sentences"`
}

type UpdateWordProfileResult struct {
	Result WordProfile `json:"result"`
}

func (u UpdateWordProfileResult) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Result WordProfile `json:"result"`
	}{
		Result: u.Result,
	})
}

func UpdateWordHandler(ctx context.Context, tracer trace.Tracer) http.HandlerFunc {
	return common.CreatePostHandlerWithIDToken(func(req *UpdateWordProfileApiSchema, idToken common.IDToken) (UpdateWordProfileResult, error) {
		updateSrc, err := req.toUpdatedWordProfileSource()
		if err != nil {
			return UpdateWordProfileResult{}, err
		}
		db, err := common.FromEnv().Open()
		if err != nil {
			return UpdateWordProfileResult{}, err
		}
		defer db.Close()
		userId := user.UserIdFromIDToken(idToken)

		// wordIdを憶測で更新できる脆弱性あり
		wordProfile, err := UpdateWordProfileByDB(ctx, db, tracer, updateSrc, userId)
		if err != nil {
			return UpdateWordProfileResult{}, err
		}
		return UpdateWordProfileResult{
			Result: wordProfile,
		}, nil
	})
}

func (s UpdateWordProfileApiSchema) toUpdatedWordProfileSource() (UpdatedWordProfileSource, error) {
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
			meaning, err := NewSentenceMeaning(sentence.Meaning)
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
		meaning, err := NewSentenceMeaning(sentence.Meaning)
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
	Word          string                             `json:"word"`
	Meaning       string                             `json:"meaning"`
	Pronunciation string                             `json:"pronunciation"`
	Remarks       string                             `json:"remarks"`
	Sentences     []registerSentenceProfileApiSchema `json:"sentences"`
}

type RegisterWordProfileResult struct {
	Result WordProfile `json:"result"`
}

func (r RegisterWordProfileResult) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Result WordProfile `json:"result"`
	}{
		Result: r.Result,
	})
}

func RegisterWordHandler(ctx context.Context) http.HandlerFunc {
	return common.CreatePostHandlerWithIDToken(func(req *RegisterWordProfileApiSchema, idToken common.IDToken) (RegisterWordProfileResult, error) {
		db, err := common.FromEnv().Open()
		if err != nil {
			return RegisterWordProfileResult{}, err
		}
		defer db.Close()
		src, err := req.toRegisterWordProfileSource(user.UserIdFromIDToken(idToken))
		if err != nil {
			return RegisterWordProfileResult{}, err
		}
		wordInfo, err := RegisterWordProfileByDB(db, src)
		if err != nil {
			return RegisterWordProfileResult{}, err
		}
		return RegisterWordProfileResult{
			Result: wordInfo,
		}, nil
	})

}

type registerSentenceProfileApiSchema struct {
	Value         string `json:"value"`
	Meaning       string `json:"meaning"`
	Pronunciation string `json:"pronunciation"`
}

func (s RegisterWordProfileApiSchema) toRegisterWordProfileSource(userId user.UserId) (RegisterWordProfileSource, error) {
	sentences := make([]Sentence, 0, len(s.Sentences))
	for _, sentence := range s.Sentences {
		value, err := NewSentenceValue(sentence.Value)
		if err != nil {
			return RegisterWordProfileSource{}, err
		}
		meaning, err := NewSentenceMeaning(sentence.Meaning)
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
	return RegisterWordProfileSource{
		UserId:    userId,
		Word:      word,
		Sentences: sentences,
		Remarks:   remarks,
	}, nil
}

type DeleteWordProfileApiSchema struct {
	WordId string `json:"wordId"`
}

type DeleteResponse struct {
	Message string `json:"message"`
}

func (d DeleteResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Message string `json:"message"`
	}{
		Message: d.Message,
	})
}

func DeleteWordHandler(ctx context.Context, tracer trace.Tracer) http.HandlerFunc {
	return common.CreatePostHandlerWithIDToken(func(req *DeleteWordProfileApiSchema, idToken common.IDToken) (DeleteResponse, error) {
		userId := user.UserIdFromIDToken(idToken)
		src, err := req.ToDeleteWordProfileSource()
		if err != nil {
			return DeleteResponse{}, err
		}
		db, err := common.FromEnv().Open()
		if err != nil {
			return DeleteResponse{}, err
		}
		defer db.Close()
		err = DeleteWordProfileByDB(ctx, db, tracer, src, userId)
		if err != nil {
			return DeleteResponse{}, err
		}
		return DeleteResponse{
			Message: "success",
		}, nil
	})
}

func (s DeleteWordProfileApiSchema) ToDeleteWordProfileSource() (DeletedWordProfileSource, error) {
	return DeletedWordProfileSource{
		WordId: WordId(s.WordId),
	}, nil
}
