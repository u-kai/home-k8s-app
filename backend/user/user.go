package user

import (
	"ele/common"
	"fmt"
	"net/http"
	"strings"
)

type UserId string

type User struct {
	Id UserId `json:"id"`
}

func UserIdFromIDToken(token common.IDToken) UserId {
	return UserId(token.Sub())
}

func authUser(userId UserId, token string) (bool, error) {
	notValidateToken := common.NewNotValidateIDToken(token)
	idToken, err := notValidateToken.ValidateIDToken()
	if err != nil {
		return false, err
	}
	if idToken.Sub() != string(userId) {
		return false, nil
	}
	return true, nil
}

func getAuthToken(r *http.Request) (string, error) {
	token := r.Header.Get("Authorization")
	if token == "" {
		return "", fmt.Errorf("Authorization header is empty")
	}
	token = strings.Replace(token, "Bearer ", "", 1)
	return token, nil
}

func authUserFromHeader(r *http.Request, userId UserId) error {
	if userId == "" {
		return fmt.Errorf("userId is empty")
	}
	token, err := getAuthToken(r)
	if err != nil {
		return err
	}
	if isAuth, err := authUser(userId, token); !isAuth || err != nil {
		return fmt.Errorf("failed to auth user")
	}
	return nil
}
