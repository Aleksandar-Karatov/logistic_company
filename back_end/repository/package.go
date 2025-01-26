package repository

import "gorm.io/gorm"

type PackageRepository struct {
	db *gorm.DB
}

func NewPackageRepository(db *gorm.DB) *PackageRepository {
	return &PackageRepository{
		db: db,
	}
}
