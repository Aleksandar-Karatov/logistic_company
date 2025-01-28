module logistic_company/repository

go 1.23.5

require (
	gorm.io/driver/mysql v1.5.7
	gorm.io/gorm v1.25.12
	logistic_company/config v0.0.0-00010101000000-000000000000
	logistic_company/model v0.0.0-00010101000000-000000000000
)

require (
	filippo.io/edwards25519 v1.1.0 // indirect
	github.com/go-sql-driver/mysql v1.8.1 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	golang.org/x/crypto v0.32.0 // indirect
	golang.org/x/text v0.21.0 // indirect
)

replace logistic_company/config => ../config

replace logistic_company/model => ../model
