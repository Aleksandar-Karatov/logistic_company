package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Company struct {
	ID      string  `gorm:"primaryKey;type:varchar(255)"`
	Name    string  `gorm:"column:company_name;not null;unique;type:varchar(255)"`
	Revenue float64 `gorm:"column:revenue;not null;type:float(8)"`
}

func (Company) TableName() string {
	return "company"
}

func (c *Company) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = uuid.New().String()
	return nil
}
