package wordbook

import (
	"context"
	"database/sql"
	"ele/common"
	"ele/user"
	"fmt"

	"go.opentelemetry.io/otel/trace"
)

func FetchWordProfileFromDBByUserId(ctx context.Context, tracer trace.Tracer, db *sql.DB, userId user.UserId) ([]WordProfile, error) {
	return fetchWordProfileFromUserIdByDB(db, tracer)(ctx, userId)
}

type registerWordProfile func(user.UserId, WordProfile) (WordProfile, error)

type RegisterWordProfileSource struct {
	UserId user.UserId
	Word
	Sentences []Sentence
	Remarks   Remarks
}

func RegisterWordProfile(
	checkExistWord func(user.UserId, Word) (bool, error),
	src RegisterWordProfileSource,
	newWordId func() WordId,
	newSentenceId func() SentenceId,
	now common.NowFunc,
	registerWordProfile registerWordProfile,
) (WordProfile, error) {
	exist, err := checkExistWord(src.UserId, src.Word)
	if err != nil {
		return WordProfile{}, err
	}
	if exist {
		return WordProfile{}, fmt.Errorf("word already exists: %v", src.Word)
	}
	sentencesProfile := make([]SentenceProfile, len(src.Sentences))
	for i, sentence := range src.Sentences {
		sentencesProfile[i] = newSentenceProfile(sentence, newSentenceId, now)
	}
	new := NewWordProfile(src.Word, newWordId, now, sentencesProfile, src.Remarks)
	_, err = registerWordProfile(src.UserId, new)
	if err != nil {
		return WordProfile{}, err
	}
	return new, nil
}
func RegisterWordProfileByDB(
	db *sql.DB,
	src RegisterWordProfileSource,
) (WordProfile, error) {
	// TODO: Implement checkExistWord more efficiently
	selectWordByUserIdAndWordValue := func(userId user.UserId, word Word) (bool, error) {
		sql := fmt.Sprintf("SELECT word_id FROM %s WHERE value=? AND user_id=?", WORD_TABLE_NAME)
		row := db.QueryRow(sql, word.Value, userId)
		var wordId WordId
		err := row.Scan(&wordId)
		if err != nil {
			return false, nil
		}
		return true, nil
	}

	return RegisterWordProfile(
		selectWordByUserIdAndWordValue,
		src,
		NewWordId(),
		NewSentenceId(),
		common.Now,
		registerWordProfileByDB(db),
	)
}

type fetchWordProfileByWordId func(context.Context, WordId) (WordProfile, error)

type updateWordProfile func(context.Context, WordProfile) error

type UpdatedWordProfileSource struct {
	WordId  WordId
	Profile UpdatedWordProfile
}

func UpdateWordProfile(
	ctx context.Context,
	src UpdatedWordProfileSource,
	fetchFn fetchWordProfileByWordId,
	updateWordProfileFn updateWordProfile,
	newId func() SentenceId,
	now common.NowFunc,
) (WordProfile, error) {
	old, err := fetchFn(ctx, src.WordId)
	if err != nil {
		return WordProfile{}, err
	}
	new := old.NewProfile(src.Profile, newId, now)
	err = updateWordProfileFn(ctx, new)
	if err != nil {
		return WordProfile{}, err
	}
	return new, nil
}

func UpdateWordProfileByDB(
	ctx context.Context,
	db *sql.DB,
	tracer trace.Tracer,
	src UpdatedWordProfileSource,
	userId user.UserId,
) (WordProfile, error) {
	return UpdateWordProfile(
		ctx,
		src,
		fetchWordProfileFromWordIdByDB(db, tracer),
		updateWordProfileByDB(db),
		NewSentenceId(),
		common.Now,
	)
}

type deleteWordProfile func(context.Context, WordId) error

type DeletedWordProfileSource struct {
	WordId WordId
}

func DeleteWordProfile(
	ctx context.Context,
	src DeletedWordProfileSource,
	deleteWordProfileFn deleteWordProfile,
) error {
	return deleteWordProfileFn(ctx, src.WordId)
}

// userIdが管理していないwordIdを削除できる脆弱性あり
func DeleteWordProfileByDB(
	ctx context.Context,
	db *sql.DB,
	tracer trace.Tracer,
	src DeletedWordProfileSource,
	userId user.UserId,
) error {
	return DeleteWordProfile(
		ctx,
		src,
		deleteWordProfileByDB(db, tracer, userId),
	)
}
