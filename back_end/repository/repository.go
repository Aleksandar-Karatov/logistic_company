package repository

import (
	"logistic_company/config"
	"logistic_company/model"
	"time"

	gormlogruslogger "github.com/aklinkert/go-gorm-logrus-logger"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Repository struct {
	db                 *gorm.DB
	EmployeeRepository *EmployeeRepository
	CompanyRepository  *CompanyRepository
	OfficeRepository   *OfficeRepository
	PackageRepository  *PackageRepository
	ClientRepository   *ClientRepository
	LoginRepository    *LoginRepository
}

func NewRepository(cfg config.Config) (*Repository, error) {
	dsn := cfg.DBUser + ":" + cfg.DBPassword + "@tcp(" + cfg.DBHost + ":" + cfg.DBPort + ")/" + cfg.DBName
	l := gormlogruslogger.NewGormLogrusLogger(log.WithField("component", "gorm"), 100*time.Millisecond)
	l.LogMode(logger.Info)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: l})
	if err != nil {
		return nil, err
	}

	return &Repository{
		db:                 db,
		EmployeeRepository: NewEmployeeRepository(db),
		CompanyRepository:  NewCompanyRepository(db),
		OfficeRepository:   NewOfficeRepository(db),
		PackageRepository:  NewPackageRepository(db),
		ClientRepository:   NewClientRepository(db),
		LoginRepository:    NewLoginRepository(db),
	}, nil
}

func (r *Repository) Migrate() error {
	return r.db.AutoMigrate(
		&model.ClientRegister{},
		&model.Company{},
		&model.EmployeeRegister{},
		&model.Office{},
		&model.Package{},
	)
}
