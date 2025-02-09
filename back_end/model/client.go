package model

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type ClientRegister struct {
	Client
	Password string `gorm:"column:password;not null;type:varchar(255)" json:"password" binding:"required"`
}

type Client struct {
	ID    string `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Name  string `gorm:"column:client_name;not null;unique;type:varchar(255)" json:"name" binding:"required"`
	Email string `gorm:"column:email;not null;unique;type:varchar(255)" json:"email" binding:"required"`
	Phone string `gorm:"column:phone;not null;unique;type:varchar(255)" json:"phone" binding:"required"`
}

func (Client) TableName() string {
	return "client"
}

// BeforeCreate is a GORM hook that is called before a Client is created.
// It sets the Password field of the Client to a bcrypt hash of the
// plaintext password that was set. This is a security measure to protect
// the password from being stored in plaintext in the database.
func (c *ClientRegister) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = uuid.New().String()
	bytes, err := bcrypt.GenerateFromPassword([]byte(c.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	c.Password = string(bytes)
	return nil
}

// BeforeUpdate is a GORM hook that is called before a Client is updated.
// If the Password field of the Client is not empty, it sets the Password
// field of the Client to a bcrypt hash of the plaintext password that was
// set. This is a security measure to protect the password from being stored
// in plaintext in the database.
func (c *ClientRegister) BeforeUpdate(tx *gorm.DB) (err error) {
	if c.Password != "" {
		bytes, err := bcrypt.GenerateFromPassword([]byte(c.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		c.Password = string(bytes)
	}
	return nil
}
