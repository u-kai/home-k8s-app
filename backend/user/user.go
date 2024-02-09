package user

type UserId string

type User struct {
	Id UserId `json:"id"`
}
