package model

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Employee struct {
	ID       string  `gorm:"primaryKey;type:varchar(255)"`
	Name     string  `gorm:"column:employee_name;not null;unique;type:varchar(255)"`
	Email    string  `gorm:"column:email;not null;unique;type:varchar(255)"`
	Password string  `gorm:"column:password;not null;type:varchar(255)"`
	Phone    string  `gorm:"column:phone;not null;unique;type:varchar(255)"`
	Role     string  `gorm:"column:role;not null;type:varchar(255)"`
	OfficeID string  `gorm:"column:office_id;type:varchar(255)"`
	Office   *Office `gorm:"foreignKey:OfficeID"`
}

func (Employee) TableName() string {
	return "employee"
}

// BeforeCreate is a GORM hook that is called before an Employee is created.
// It sets the Password field of the Employee to a bcrypt hash of the
// plaintext password that was set. This is a security measure to protect
// the password from being stored in plaintext in the database.
func (c *Employee) BeforeCreate(tx *gorm.DB) (err error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(c.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	c.Password = string(bytes)
	return nil
}

// BeforeUpdate is a GORM hook that is called before an Employee is updated.
// If the Password field of the Employee is not empty, it sets the Password
// field of the Employee to a bcrypt hash of the plaintext password that was
// set. This is a security measure to protect the password from being stored
// in plaintext in the database.
func (c *Employee) BeforeUpdate(tx *gorm.DB) (err error) {
	if c.Password != "" {
		bytes, err := bcrypt.GenerateFromPassword([]byte(c.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		c.Password = string(bytes)
	}
	return nil
}
