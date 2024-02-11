package wordbook

import (
	"database/sql"
	"ele/user"
)

type fetchWordProfileFromUserId func(user.UserId) ([]WordProfile, error)

type fetchSentencesFromWordId func(WordId) ([]SentenceProfile, error)

func fetchSentencesFromWordIdByDB(db *sql.DB) fetchSentencesFromWordId {
	return func(wordId WordId) ([]SentenceProfile, error) {
		sql, wordId := selectSentenceByWordIdSql(wordId)
		rows, err := db.Query(sql.String(), wordId)
		if err != nil {
			return nil, err
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
				return nil, err
			}
			result = append(result, SentenceProfile{
				SentenceId:    sentenceId,
				Value:         value,
				Meaning:       meaning,
				Pronunciation: pronunciation,
				CreatedAt:     createdAt,
				UpdatedAt:     updatedAt,
			})
		}
		return result, nil
	}
}

func FetchWordProfileFromUserIdByDB(db *sql.DB) fetchWordProfileFromUserId {
	return func(userId user.UserId) ([]WordProfile, error) {
		sql, userId := selectWordProfileByUserIdSql(userId)
		rows, err := db.Exec(sql.String(), userId)
		if err != nil {
			return nil, err
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
			var value string
			var meaning string
			var pronunciation string
			var createdAt int64
			var updatedAt int64
			var missCount int
			var remarks string
			var likeRates string
			err = rows.Scan(&wordId, &value, &meaning, &pronunciation, &createdAt, &updatedAt, &missCount, &remarks, &likeRates)
			if err != nil {
				return nil, err
			}
			// join sentences
			sentences, err := fetchSentencesFromWordIdByDB(db)(wordId)
			if err != nil {
				return nil, err
			}
		}
		return result
	}
}

func RegisterWordProfileByDB(db *sql.DB) registerWordProfile {
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
			return WordProfile{}, err
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
				return WordProfile{}, err
			}
		}
		return word, nil
	}
}

func UpdateWordProfileByDB(db *sql.DB) updateWordProfile {
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
			return err
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
				return err
			}
		}
		return nil
	}
}
