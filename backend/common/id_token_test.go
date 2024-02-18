package common_test

import (
	"ele/common"
	"fmt"
	"os"
	"testing"
)

func TestValidateIDToken(t *testing.T) {
	token := os.Getenv("ID_TOKEN")
	if token == "" {
		t.Errorf("ID_TOKEN not set")
	}
	notValidateIDToken := common.NewNotValidateIDToken(token)
	validToken, err := notValidateIDToken.ValidateIDToken()
	if err != nil {
		t.Errorf("Error: %s", err)
	}
	if len(validToken.Aud()) == 0 {
		t.Errorf("IDToken is empty")
	}
	if len(validToken.Sub()) == 0 {
		t.Errorf("IDToken is empty")
	}
	fmt.Println(validToken.Aud())
	fmt.Println(validToken.Sub())
}
