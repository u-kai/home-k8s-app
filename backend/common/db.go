package common

import (
	"github.com/google/uuid"
	"time"
)

func NewID() string {
	return uuid.NewString()
}

func Now() int64 {
	return time.Now().Unix()
}
