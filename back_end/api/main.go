package main

import (
	"logistic_company/api/service/router"
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

	router, err := router.NewRouter(repos, cfg)
	if err != nil {
		log.Errorf("Error while creating router, %s", err)
	}
	if err := router.Run(); err != nil {
		log.Errorf("Error while running server, %s", err)
	}
}
