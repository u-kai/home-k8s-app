package wordbook

import (
	"ele/user"
	"fmt"
)

type SQL string

func (sql SQL) String() string {
	return string(sql)
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
const WORD_TABLE_NAME = "words"

// sentence_id INT AUTO_INCREMENT PRIMARY KEY,
// word_id VARCHAR(255) NOT NULL,
// value TEXT NOT NULL,
// meaning TEXT,
// pronunciation VARCHAR(255),
// created_at BIGINT NOT NULL,
// updated_at BIGINT NOT NULL,
// FOREIGN KEY (word_id) REFERENCES words(word_id)
const SENTENCE_TABLE_NAME = "sentences"

func selectWordProfileByUserIdSql(userId user.UserId) (SQL, user.UserId) {
	sql := fmt.Sprintf("SELECT * FROM %s WHERE user_id=?", WORD_TABLE_NAME)
	return SQL(sql), userId
}
func selectWordProfileByWordIdSql(wordId WordId) (SQL, WordId) {
	sql := fmt.Sprintf("SELECT * FROM %s WHERE word_id=?", WORD_TABLE_NAME)
	return SQL(sql), wordId
}
func selectSentenceProfileByWordIdSql(wordId WordId) (SQL, WordId) {
	sql := fmt.Sprintf("SELECT * FROM %s WHERE word_id=?", SENTENCE_TABLE_NAME)
	return SQL(sql), wordId
}

func insertWordProfileSql(userId user.UserId, word WordProfile) (
	SQL,
	user.UserId,
	WordId,
	WordValue,
	Meaning,
	Pronunciation,
	int64,
	int64,
	MissCount,
	Remarks,
	LikeRates,
) {
	sql := fmt.Sprintf("INSERT INTO %s (user_id, word_id, value, meaning, pronunciation, created_at, updated_at, miss_count, remarks, like_rates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", WORD_TABLE_NAME)
	return SQL(sql), userId, word.WordId, word.Value, word.Meaning, word.Pronunciation, word.CreatedAt, word.UpdatedAt, word.MissCount, word.Remarks, word.LikeRates
}

func insertSentenceProfileSql(wordId WordId, sentence SentenceProfile) (
	SQL,
	WordId,
	SentenceId,
	SentenceValue,
	SentenceMeaning,
	Pronunciation,
	int64,
	int64,
) {
	sql := fmt.Sprintf("INSERT INTO  %s (word_id, sentence_id, value, meaning, pronunciation, created_at,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)", SENTENCE_TABLE_NAME)
	return SQL(sql), wordId, sentence.SentenceId, sentence.Value, sentence.Meaning, sentence.Pronunciation, sentence.CreatedAt, sentence.UpdatedAt
}

func updateWordProfileSql(word WordProfile) (
	SQL,
	WordValue,
	Meaning,
	Pronunciation,
	int64,
	MissCount,
	Remarks,
	LikeRates,
	WordId,
) {
	sql := fmt.Sprintf("UPDATE %s SET value=?, meaning=?, pronunciation=?, updated_at=?, miss_count=?, remarks=?, like_rates=? WHERE word_id=?", WORD_TABLE_NAME)
	return SQL(sql), word.Value, word.Meaning, word.Pronunciation, word.UpdatedAt, word.MissCount, word.Remarks, word.LikeRates, word.WordId
}

func updateSentenceProfileSql(sentence SentenceProfile) (
	SQL,
	SentenceValue,
	SentenceMeaning,
	Pronunciation,
	int64,
	SentenceId,
) {
	sql := fmt.Sprintf("UPDATE %s SET value=?, meaning=?, pronunciation=?, updated_at=? WHERE sentence_id=?", SENTENCE_TABLE_NAME)
	return SQL(sql), sentence.Value, sentence.Meaning, sentence.Pronunciation, sentence.UpdatedAt, sentence.SentenceId
}

func deleteWordProfileSql(wordId WordId) (SQL, WordId) {
	sql := fmt.Sprintf("DELETE FROM %s WHERE word_id=?", WORD_TABLE_NAME)
	return SQL(sql), wordId
}

// TODO: FIX ME
func deleteSentenceProfileSql(wordId WordId, sentenceId SentenceId) (SQL, WordId, SentenceId) {
	// delete all sentences by one query
	sql := fmt.Sprintf("DELETE FROM %s WHERE word_id = ? and sentence_id = ?", SENTENCE_TABLE_NAME)
	return SQL(sql), wordId, sentenceId
}
