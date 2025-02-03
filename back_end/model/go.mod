module logistic_company/model

go 1.23.5

require (
	github.com/google/uuid v1.6.0
	golang.org/x/crypto v0.32.0
	gorm.io/gorm v1.25.12
	logistic_company/config v0.0.0-00010101000000-000000000000
)

require (
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/kelseyhightower/envconfig v1.4.0 // indirect
	golang.org/x/text v0.21.0 // indirect
)

replace logistic_company/config => ../config
