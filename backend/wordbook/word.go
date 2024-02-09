package wordbook

import "user"

type Word struct {
	UserId    user.User  `json:"userId"`
	Value     string     `json:"value"`
	Meaning   string     `json:"meaning"`
	Sentences []Sentence `json:"sentences"`
}
