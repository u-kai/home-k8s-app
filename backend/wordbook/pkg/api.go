package wordbook

type UpdateWordProfileApiSchema struct {
	UserId        string                           `json:"userId"`
	Word          string                           `json:"word"`
	WordId        string                           `json:"wordId"`
	Meaning       string                           `json:"meaning"`
	Pronunciation string                           `json:"pronunciation"`
	Remarks       string                           `json:"remarks"`
	Sentences     []updateSentenceProfileApiSchema `json:"sentences"`
}

type updateSentenceProfileApiSchema struct {
	SentenceId    string `json:"sentenceId"`
	Value         string `json:"value"`
	Meaning       string `json:"meaning"`
	Pronunciation string `json:"pronunciation"`
}

type RegisterWordProfileApiSchema struct {
	UserId        string                             `json:"userId"`
	WordId        string                             `json:"wordId"`
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

type DeleteWordProfileApiSchema struct {
	UserId string `json:"userId"`
	WordId string `json:"wordId"`
}
