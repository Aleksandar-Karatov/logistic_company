package model

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type EmployeeRegister struct {
	Employee
	Password string `gorm:"column:password;not null;type:varchar(255)" json:"password" binding:"required"`
}

type Employee struct {
	ID        string   `gorm:"primaryKey;type:varchar(255)"`
	Name      string   `gorm:"column:employee_name;not null;unique;type:varchar(255)" json:"name" binding:"required"`
	Email     string   `gorm:"column:email;not null;unique;type:varchar(255)" json:"email" binding:"required"`
	Phone     string   `gorm:"column:phone;not null;unique;type:varchar(255)" json:"phone" binding:"required"`
	Role      string   `gorm:"column:role;not null;type:varchar(255)" json:"role" binding:"required"`
	CompanyID *string  `gorm:"column:company_id;null;type:varchar(255)" json:"companyID" binding:"required"`
	Company   *Company `gorm:"foreignKey:CompanyID" json:"company"`
	OfficeID  *string  `gorm:"column:office_id;type:varchar(255)" json:"officeID"`
	Office    *Office  `gorm:"foreignKey:OfficeID" json:"office"`
}

func (Employee) TableName() string {
	return "employee"
}

// BeforeCreate is a GORM hook that is called before an Employee is created.
// It sets the Password field of the Employee to a bcrypt hash of the
// plaintext password that was set. This is a security measure to protect
// the password from being stored in plaintext in the database.
func (c *EmployeeRegister) BeforeCreate(tx *gorm.DB) (err error) {
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
func (c *EmployeeRegister) BeforeUpdate(tx *gorm.DB) (err error) {
	if c.Password != "" {
		bytes, err := bcrypt.GenerateFromPassword([]byte(c.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		c.Password = string(bytes)
	}
	return nil
}
