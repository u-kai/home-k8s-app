package wordbook

import (
	"ele/common"
	"ele/user"
)

type registerWordProfile func(user.UserId, WordProfile) (WordProfile, error)
type registerSentencesProfile func([]SentenceProfile) (SentenceProfile, error)

func RegisterWordProfile(
	userId user.UserId,
	word Word,
	newId func() WordId,
	now common.NowFunc,
	sentences []SentenceProfile,
	remarks Remarks,
	registerWordProfile registerWordProfile,
	registerSentenceProfile registerSentencesProfile,
) (WordProfile, error) {
	new := NewWordProfile(word, newId, now, sentences, remarks)
	_, err := registerWordProfile(userId, new)
	if err != nil {
		return WordProfile{}, err
	}
	_, err = registerSentenceProfile(sentences)
	if err != nil {
		return WordProfile{}, err
	}
	return new, nil
}

type fetchWordProfileByWordId func(WordId) (WordProfile, error)
type updateWordProfile func(WordProfile) error

func UpdateWordProfile(
	wordId WordId,
	updatedProfile UpdatedWordProfile,
	fetchFn fetchWordProfileByWordId,
	updateFn updateWordProfile,
	newId func() SentenceId,
	now common.NowFunc,
) (WordProfile, error) {
	old, err := fetchFn(wordId)
	if err != nil {
		return WordProfile{}, err
	}
	new := old.NewProfile(updatedProfile, newId, now)
	err = updateFn(new)
	if err != nil {
		return WordProfile{}, err
	}
	return new, nil
}
