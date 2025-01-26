package repository

import "gorm.io/gorm"

type OfficeRepository struct {
	db *gorm.DB
}

func NewOfficeRepository(db *gorm.DB) *OfficeRepository {
	return &OfficeRepository{
		db: db,
	}
}
