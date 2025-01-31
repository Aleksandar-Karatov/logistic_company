package repository

import (
	"context"
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

func (c *ClientRepository) GetAllClients(ctx context.Context, clients *[]model.Client, limit, offset int) error {
	return c.db.WithContext(ctx).Limit(limit).Offset(offset).Find(clients).Error
}

func (c *ClientRepository) GetClientsByCompanyID(ctx context.Context, clients *[]model.Client, id string, limit, offset int) error {
	return c.db.WithContext(ctx).Limit(limit).Offset(offset).Where("company_id = ?", id).Find(clients).Error
}

func (c *ClientRepository) GetClientsByName(ctx context.Context, clients *[]model.Client, name string, limit, offset int) error {
	return c.db.WithContext(ctx).Limit(limit).Offset(offset).Where("name LIKE '%?%'", name).Find(clients).Error
}

func (c *ClientRepository) GetClientByID(ctx context.Context, client *model.Client, id string) error {
	return c.db.WithContext(ctx).Where("id = ?", id).First(client).Error
}

func (c *ClientRepository) CreateClient(ctx context.Context, client *model.ClientRegister) error {
	return c.db.WithContext(ctx).Model(&client).Create(client).Error
}

func (c *ClientRepository) UpdateClient(ctx context.Context, client *model.ClientRegister) error {
	return c.db.WithContext(ctx).Model(&client).Updates(&client).Error
}

func (c *ClientRepository) DeleteClient(ctx context.Context, id string) error {
	return c.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Client{}).Error
}
