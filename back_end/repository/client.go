package repository

import (
	"logistic_company/model"

	"gorm.io/gorm"
)

type ClientRepository struct {
	db *gorm.DB
}

func NewClientRepository(db *gorm.DB) *ClientRepository {
	return &ClientRepository{
		db: db,
	}
}

func (c *ClientRepository) GetAllClients(clients *[]model.Client, limit, offset int) error {
	return c.db.Limit(limit).Offset(offset).Find(clients).Error
}

func (c *ClientRepository) GetClientsByCompanyID(clients *[]model.Client, id string, limit, offset int) error {
	return c.db.Limit(limit).Offset(offset).Where("company_id = ?", id).Find(clients).Error
}

func (c *ClientRepository) GetClientsByName(clients *[]model.Client, name string, limit, offset int) error {
	return c.db.Limit(limit).Offset(offset).Where("name LIKE '%?%'", name).Find(clients).Error
}

func (c *ClientRepository) GetClientByID(client *model.Client, id string) error {
	return c.db.Where("id = ?", id).First(client).Error
}

func (c *ClientRepository) CreateClient(client *model.Client) error {
	return c.db.Model(&client).Create(client).Error
}

func (c *ClientRepository) UpdateClient(client *model.Client) error {
	return c.db.Model(&client).Updates(&client).Error
}

func (c *ClientRepository) DeleteClient(id string) error {
	return c.db.Where("id = ?", id).Delete(&model.Client{}).Error
}
