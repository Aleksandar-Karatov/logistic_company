package main

import (
	"logistic_company/config"
	"logistic_company/repository"

	log "github.com/sirupsen/logrus"
)

func main() {
	cfg, err := config.LoadConfig()

	if err != nil {
		log.Errorf("Error while loading config, %s", err)
	}

	repos, err := repository.NewRepository(*cfg)
	if err != nil {
		log.Errorf("Error while creating repository, %s", err)
	}

	if err := repos.Migrate(); err != nil {
		log.Errorf("Error while migrating database, %s", err)
	}
	log.Info("Database migrated successfully")
}
