package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Office struct {
	ID        string   `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Location  string   `gorm:"column:location;not null;type:varchar(255)" json:"location" binding:"required"`
	CompanyID string   `gorm:"column:company_id;not null;type:varchar(255)" json:"companyID" binding:"required"`
	Company   *Company `gorm:"foreignKey:CompanyID" json:"company"`
}

func (Office) TableName() string {
	return "office"
}

func (o *Office) BeforeCreate(tx *gorm.DB) (err error) {
	o.ID = uuid.New().String()
	return nil
}
