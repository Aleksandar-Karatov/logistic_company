package repository

import (
	"logistic_company/config"
	"logistic_company/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Repository struct {
	db                 *gorm.DB
	EmployeeRepository *EmployeeRepository
	CompanyRepository  *CompanyRepository
	OfficeRepository   *OfficeRepository
	PackageRepository  *PackageRepository
	ClientRepository   *ClientRepository
}

func NewRepository(cfg config.Config) (*Repository, error) {
	dsn := cfg.DBUser + ":" + cfg.DBPassword + "@tcp(" + cfg.DBHost + ":" + cfg.DBPort + ")/" + cfg.DBName

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
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
	}, nil
}

func (r *Repository) Migrate() error {
	return r.db.AutoMigrate(
		&model.Client{},
		&model.Company{},
		&model.Employee{},
		&model.Office{},
		&model.Package{},
	)
}
