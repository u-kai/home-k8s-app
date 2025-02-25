package common

import (
	"log/slog"
	"os"
	"time"

	"database/sql"

	"github.com/XSAM/otelsql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"go.opentelemetry.io/otel/attribute"
)

type MySQLClient struct {
	user     string
	password string
	host     string
	port     string
	database string
}

func FromEnv() *MySQLClient {
	slog.Info("MySQLINFO", "MYSQL_USER", os.Getenv("MYSQL_USER"), "MYSQL_HOST", os.Getenv("MYSQL_HOST"), "MYSQL_DATABASE", os.Getenv("MYSQL_DATABASE"), "MYSQL_PORT", os.Getenv("MYSQL_PORT"))
	return &MySQLClient{
		user:     os.Getenv("MYSQL_USER"),
		password: os.Getenv("MYSQL_PASSWORD"),
		host:     os.Getenv("MYSQL_HOST"),
		database: os.Getenv("MYSQL_DATABASE"),
		port:     os.Getenv("MYSQL_PORT"),
	}
}

func (c *MySQLClient) Open() (*sql.DB, error) {
	return otelsql.Open("mysql", c.user+":"+c.password+"@tcp("+c.host+":"+c.port+")/"+c.database, otelsql.WithAttributes(attribute.String("db.system", "mysql")))
}

type ID interface {
	String() string
}
type NewIdFunc func() ID

type uuid32 string

func (u uuid32) String() string {
	return string(u)
}
func NewID() ID {
	return uuid32(uuid.NewString())
}

type NowFunc func() int64

func Now() int64 {
	return time.Now().Unix()
}

// Fakes
func NewFakeID(fakeId string) NewIdFunc {
	return func() ID {
		return uuid32(fakeId)
	}
}
func NewFakeNow(fakeNow int64) NowFunc {
	return func() int64 {
		return fakeNow
	}
}
