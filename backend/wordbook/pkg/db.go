package wordbook

import (
	"database/sql"
	"ele/user"
	"fmt"
)

type fetchWordProfileFromUserId func(user.UserId) ([]WordProfile, error)

type fetchSentencesFromWordId func(WordId) ([]SentenceProfile, error)

func fetchSentencesFromWordIdByDB(db *sql.DB) fetchSentencesFromWordId {
	return func(wordId WordId) ([]SentenceProfile, error) {
		sql, wordId := selectSentenceProfileByWordIdSql(wordId)
		rows, err := db.Query(sql.String(), wordId)
		if err != nil {
			return nil, fmt.Errorf("failed to select sentences query: %w", err)
		}
		result := []SentenceProfile{}
		for rows.Next() {
			// sentence_id INT AUTO_INCREMENT PRIMARY KEY,
			// word_id VARCHAR(255) NOT NULL,
			// value TEXT NOT NULL,
			// meaning TEXT,
			// pronunciation VARCHAR(255),
			// created_at BIGINT NOT NULL,
			// updated_at BIGINT NOT NULL,
			// FOREIGN KEY (word_id) REFERENCES words(word_id)
			var sentenceId string
			var wordIdDummy string
			var value string
			var meaning string
			var pronunciation string
			var createdAt int64
			var updatedAt int64
			err = rows.Scan(&sentenceId, &wordIdDummy, &value, &meaning, &pronunciation, &createdAt, &updatedAt)
			if err != nil {
				return nil, fmt.Errorf("failed to sentence scan: %w", err)
			}
			sentenceValue, err := NewSentenceValue(value)
			if err != nil {
				return nil, err
			}
			sentenceMeaning, err := NewMeaning(meaning)
			if err != nil {
				return nil, err
			}
			sentencePronunciation, err := NewPronunication(pronunciation)
			if err != nil {
				return nil, err
			}
			sentence := Sentence{
				Value:         sentenceValue,
				Meaning:       sentenceMeaning,
				Pronunciation: sentencePronunciation,
			}
			result = append(result, SentenceProfile{
				SentenceId: SentenceId(sentenceId),
				Sentence:   sentence,
				CreatedAt:  createdAt,
				UpdatedAt:  updatedAt,
			})
		}
		return result, nil
	}
}

func fetchWordProfileFromUserIdByDB(db *sql.DB) fetchWordProfileFromUserId {
	return func(userId user.UserId) ([]WordProfile, error) {
		sql, userId := selectWordProfileByUserIdSql(userId)
		rows, err := db.Query(sql.String(), userId)
		if err != nil {
			return nil, fmt.Errorf("failed to select words query: %w", err)
		}
		// user_id VARCHAR(255) NOT NULL,
		// word_id VARCHAR(255) PRIMARY KEY,
		// value VARCHAR(255) NOT NULL,
		// meaning TEXT,
		// pronunciation VARCHAR(255),
		// created_at BIGINT NOT NULL,
		// updated_at BIGINT NOT NULL,
		// miss_count INT,
		// remarks TEXT,
		// like_rates TEXT,
		result := []WordProfile{}
		for rows.Next() {
			var wordId string
			var userId string
			var value string
			var meaning string
			var pronunciation string
			var createdAt int64
			var updatedAt int64
			var missCount int
			var remarks string
			var likeRates string
			err = rows.Scan(&wordId, &userId, &value, &meaning, &pronunciation, &createdAt, &updatedAt, &missCount, &remarks, &likeRates)
			if err != nil {
				return nil, fmt.Errorf("failed to word scan: %w", err)
			}
			// join sentences
			sentences, err := fetchSentencesFromWordIdByDB(db)(WordId(wordId))
			if err != nil {
				return nil, err
			}
			wordValue, err := NewWordValue(value)
			if err != nil {
				return nil, err
			}
			wordMeaning, err := NewMeaning(meaning)
			if err != nil {
				return nil, err
			}
			wordPronunciation, err := NewPronunication(pronunciation)
			if err != nil {
				return nil, err
			}
			wordRemarks, err := NewRemarks(remarks)
			if err != nil {
				return nil, err
			}
			wordLikeRates, err := NewLikeRates(likeRates)
			if err != nil {
				return nil, err
			}

			word := NewWord(wordValue, wordMeaning, wordPronunciation)
			wordProfile := WordProfile{
				WordId:    WordId(wordId),
				Word:      word,
				Sentences: sentences,
				CreatedAt: createdAt,
				UpdatedAt: updatedAt,
				MissCount: MissCount(missCount),
				Remarks:   wordRemarks,
				LikeRates: wordLikeRates,
			}
			result = append(result, wordProfile)

		}
		return result, nil
	}
}
func fetchWordProfileFromWordIdByDB(db *sql.DB) fetchWordProfileByWordId {
	return func(wordId WordId) (WordProfile, error) {
		sql, wordId := selectWordProfileByWordIdSql(wordId)
		rows, err := db.Query(sql.String(), wordId)
		if err != nil {
			return WordProfile{}, err
		}
		for rows.Next() {
			var userId string
			var wordIdStr string
			var value string
			var meaning string
			var pronunciation string
			var createdAt int64
			var updatedAt int64
			var missCount int
			var remarks string
			var likeRates string
			err = rows.Scan(&userId, &wordIdStr, &value, &meaning, &pronunciation, &createdAt, &updatedAt, &missCount, &remarks, &likeRates)

			if err != nil {
				return WordProfile{}, fmt.Errorf("failed to words scan: %w", err)
			}
			// join sentences
			sentences, err := fetchSentencesFromWordIdByDB(db)(WordId(wordId))
			if err != nil {
				return WordProfile{}, err
			}
			wordValue, err := NewWordValue(value)
			if err != nil {
				return WordProfile{}, err
			}
			wordMeaning, err := NewMeaning(meaning)
			if err != nil {
				return WordProfile{}, err
			}
			wordPronunciation, err := NewPronunication(pronunciation)
			if err != nil {
				return WordProfile{}, err
			}
			wordRemarks, err := NewRemarks(remarks)
			if err != nil {
				return WordProfile{}, err
			}
			wordLikeRates, err := NewLikeRates(likeRates)
			if err != nil {
				return WordProfile{}, err
			}
			return WordProfile{
				WordId:    wordId,
				Word:      NewWord(wordValue, wordMeaning, wordPronunciation),
				Sentences: sentences,
				CreatedAt: createdAt,
				UpdatedAt: updatedAt,
				MissCount: MissCount(missCount),
				Remarks:   wordRemarks,
				LikeRates: wordLikeRates,
			}, nil

		}
		return WordProfile{}, fmt.Errorf("word profile not found: %v", wordId)
	}
}

func registerWordProfileByDB(db *sql.DB) registerWordProfile {
	return func(userId user.UserId, word WordProfile) (WordProfile, error) {
		sql, userId, wordId, wordValue, meaning, pronunciation, createdAt, updatedAt, missCount, remarks, likeRates := insertWordProfileSql(userId, word)
		_, err := db.Exec(
			sql.String(),
			userId,
			wordId,
			wordValue,
			meaning,
			pronunciation,
			createdAt,
			updatedAt,
			missCount,
			remarks,
			likeRates,
		)
		if err != nil {
			return WordProfile{}, fmt.Errorf("failed to insert word profile:%v: %w", word, err)
		}
		for _, sentence := range word.Sentences {
			sql, sentenceId, wordId, value, meaning, pronunciation, createdAt, updatedAt := insertSentenceProfileSql(wordId, sentence)
			_, err := db.Exec(
				sql.String(),
				sentenceId,
				wordId,
				value,
				meaning,
				pronunciation,
				createdAt,
				updatedAt,
			)
			if err != nil {
				return WordProfile{}, fmt.Errorf("failed to insert sentence profile:%v: %w", sentence, err)
			}
		}
		return word, nil
	}
}

func updateWordProfileByDB(db *sql.DB) updateWordProfile {
	return func(word WordProfile) error {
		sql, wordId, wordValue, meaning, pronunciation, updatedAt, missCount, remarks, likeRates := updateWordProfileSql(word)
		_, err := db.Exec(
			sql.String(),
			wordId,
			wordValue,
			meaning,
			pronunciation,
			updatedAt,
			missCount,
			remarks,
			likeRates,
		)
		if err != nil {
			return fmt.Errorf("failed to update word profile:%v: %w", word, err)
		}
		for _, sentence := range word.Sentences {
			sql, value, meaning, pronunciation, updatedAt, sentenceId := updateSentenceProfileSql(sentence)
			_, err := db.Exec(
				sql.String(),
				value,
				meaning,
				pronunciation,
				updatedAt,
				sentenceId,
			)
			if err != nil {
				return fmt.Errorf("failed to update sentence profile:%v: %w", sentence, err)
			}
		}
		return nil
	}
}

func deleteWordProfileByDB(db *sql.DB, userId user.UserId) deleteWordProfile {
	return func(wordId WordId) error {
		wordProfile, err := fetchWordProfileFromWordIdByDB(db)(wordId)
		if err != nil {
			return err
		}
		for _, sentence := range wordProfile.Sentences {
			sql, wordId, sentenceId := deleteSentenceProfileSql(wordId, sentence.SentenceId)
			_, err := db.Exec(sql.String(), wordId, sentenceId)
			if err != nil {
				return err
			}
		}
		sql, wordId := deleteWordProfileSql(wordId)
		_, err = db.Exec(sql.String(), wordId)
		if err != nil {
			return err
		}
		return nil
	}
}
