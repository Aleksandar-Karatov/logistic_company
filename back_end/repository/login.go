package repository

import (
	"context"
	"errors"
	"logistic_company/config"
	"logistic_company/model"

	"gorm.io/gorm"
)

type LoginRepository struct {
	db *gorm.DB
}

func NewLoginRepository(db *gorm.DB) *LoginRepository {
	return &LoginRepository{
		db: db,
	}
}

func (l *LoginRepository) Login(ctx context.Context, email, password string) (string, error) {
	var employee *model.Employee
	if err := l.db.WithContext(ctx).Model(&model.Employee{}).
		Where("email = ? AND password = ?", email, password).
		First(&employee).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", err
	}
	if employee != nil {
		return employee.Role, nil
	}
	var id *string

	if err := l.db.WithContext(ctx).Model(&model.Client{}).Select(config.Id).
		Where("email = ? AND password = ?", email, password).
		First(&id).Error; err != nil {
		return "", err
	}
	if id != nil {
		return config.RoleClient, nil
	}
	return "", errors.New("could not find user")
}
