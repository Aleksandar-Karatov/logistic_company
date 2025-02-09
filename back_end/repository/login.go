package repository

import (
	"context"
	"errors"
	"fmt"
	"logistic_company/config"
	"logistic_company/model"

	"golang.org/x/crypto/bcrypt"
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

func (l *LoginRepository) Login(ctx context.Context, email, password string) (string, string, error) {
	var employee *model.EmployeeRegister
	if err := l.db.WithContext(ctx).Model(&model.EmployeeRegister{}).
		Where("email = ?", email).
		First(&employee).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", "", err
	}
	fmt.Println(employee)
	if employee.ID != "" {
		if err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(password)); err != nil {
			return "", "", errors.New("invalid password")
		}
		return employee.ID, employee.Role, nil
	}

	var client *model.ClientRegister

	if err := l.db.WithContext(ctx).Model(&model.ClientRegister{}).
		Where("email = ?", email).
		First(&client).Error; err != nil {
		return "", "", err
	}

	if client != nil {
		if err := bcrypt.CompareHashAndPassword([]byte(client.Password), []byte(password)); err != nil {
			fmt.Println(err)
			return "", "", errors.New("invalid password")
		}
		return client.ID, config.RoleClient, nil
	}

	return "", "", errors.New("could not find user")
}
