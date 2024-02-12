package wordbook

import (
	"database/sql"
	"ele/common"
	"ele/user"
)

func FetchWordProfileFromDBByUserId(db *sql.DB, userId user.UserId) ([]WordProfile, error) {
	return fetchWordProfileFromUserIdByDB(db)(userId)
}

type registerWordProfile func(user.UserId, WordProfile) (WordProfile, error)

type RegisterWordProfileSource struct {
	UserId user.UserId
	Word
	Sentences []Sentence
	Remarks   Remarks
}

func RegisterWordProfile(
	src RegisterWordProfileSource,
	newWordId func() WordId,
	newSentenceId func() SentenceId,
	now common.NowFunc,
	registerWordProfile registerWordProfile,
) (WordProfile, error) {
	sentencesProfile := make([]SentenceProfile, len(src.Sentences))
	for i, sentence := range src.Sentences {
		sentencesProfile[i] = newSentenceProfile(sentence, newSentenceId, now)
	}
	new := NewWordProfile(src.Word, newWordId, now, sentencesProfile, src.Remarks)
	_, err := registerWordProfile(src.UserId, new)
	if err != nil {
		return WordProfile{}, err
	}
	return new, nil
}
func RegisterWordProfileByDB(
	db *sql.DB,
	src RegisterWordProfileSource,
) (WordProfile, error) {
	return RegisterWordProfile(
		src,
		NewWordId(),
		NewSentenceId(),
		common.Now,
		registerWordProfileByDB(db),
	)
}

type fetchWordProfileByWordId func(WordId) (WordProfile, error)

type updateWordProfile func(WordProfile) error

type UpdatedWordProfileSource struct {
	WordId  WordId
	Profile UpdatedWordProfile
}

func UpdateWordProfile(
	src UpdatedWordProfileSource,
	fetchFn fetchWordProfileByWordId,
	updateWordProfileFn updateWordProfile,
	newId func() SentenceId,
	now common.NowFunc,
) (WordProfile, error) {
	old, err := fetchFn(src.WordId)
	if err != nil {
		return WordProfile{}, err
	}
	new := old.NewProfile(src.Profile, newId, now)
	err = updateWordProfileFn(new)
	if err != nil {
		return WordProfile{}, err
	}
	return new, nil
}

func UpdateWordProfileByDB(
	db *sql.DB,
	src UpdatedWordProfileSource,
) (WordProfile, error) {
	return UpdateWordProfile(
		src,
		fetchWordProfileFromWordIdByDB(db),
		updateWordProfileByDB(db),
		NewSentenceId(),
		common.Now,
	)
}

type deleteWordProfile func(WordId) error

type DeletedWordProfileSource struct {
	WordId WordId
}

func DeleteWordProfile(
	src DeletedWordProfileSource,
	deleteWordProfileFn deleteWordProfile,
) error {
	return deleteWordProfileFn(src.WordId)
}
func DeleteWordProfileByDB(
	db *sql.DB,
	src DeletedWordProfileSource,
) error {
	return DeleteWordProfile(
		src,
		deleteWordProfileByDB(db),
	)
}
