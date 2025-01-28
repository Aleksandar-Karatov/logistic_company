package config

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	DBHost     string `envconfig:"DB_HOST"`
	DBPort     string `envconfig:"DB_PORT"`
	DBUser     string `envconfig:"DB_USER"`
	DBPassword string `envconfig:"DB_PASSWORD"`
	DBName     string `envconfig:"DB_NAME"`

	APIhost      string `envconfig:"API_HOST"`
	APIport      string `envconfig:"API_PORT"`
	JWTSecretKey string `envconfig:"JWT_SECRET_KEY"`
}

func LoadConfig() (*Config, error) {
	cfg := Config{}
	if err := godotenv.Load(); err != nil {
		return nil, err
	}
	err := envconfig.Process("", &cfg)
	fmt.Printf("Loaded config: %+v", cfg)
	if err != nil {
		return nil, err
	}
	return &cfg, nil
}
