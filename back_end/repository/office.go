package repository

import (
	"context"
	"errors"
	"logistic_company/model"

	"gorm.io/gorm"
)

type OfficeRepository struct {
	db *gorm.DB
}

func NewOfficeRepository(db *gorm.DB) *OfficeRepository {
	return &OfficeRepository{
		db: db,
	}
}

func (o *OfficeRepository) GetAllOffices(ctx context.Context, offices *[]model.Office, limit, offset int) error {
	return o.db.WithContext(ctx).Offset(offset).Limit(limit).Find(offices).Error
}

func (o *OfficeRepository) GetOfficeById(ctx context.Context, office *model.Office, id string) error {
	return o.db.WithContext(ctx).Where("id = ?", id).First(office).Error
}

func (o *OfficeRepository) CreateOffice(ctx context.Context, office *model.Office) error {
	return o.db.WithContext(ctx).Model(&office).Create(office).Error
}

func (o *OfficeRepository) UpdateOffice(ctx context.Context, office *model.Office) error {
	return o.db.WithContext(ctx).Model(&office).Updates(office).Error
}

func (o *OfficeRepository) DeleteOffice(ctx context.Context, id string) error {
	tx := o.db.WithContext(ctx).Begin()

	err := o.reassignEmployees(tx, id)
	if err != nil {
		tx.Rollback()
		return err
	}
	err = tx.WithContext(ctx).Where("id = ?", id).Delete(&model.Office{}).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()
	return nil
}

func (o *OfficeRepository) reassignEmployees(tx *gorm.DB, id string) error {
	employees := []model.Employee{}
	office := model.Office{}

	if err := tx.Model(&model.Office{}).Where("id = ?", id).First(&office).Error; err != nil {
		return err
	}

	if err := tx.Model(&model.Employee{}).Where("office_id = ?", id).Find(&employees).Error; err != nil {
		return err
	}
	offices := []model.Office{}

	if err := tx.Model(&model.Office{}).Where("company_id = ?", office.CompanyID).
		Where("id <> ?", id).
		Find(&offices).Error; err != nil {
		return err
	}

	if len(offices) == 0 {
		return errors.New("no offices available")
	}

	for i := 0; i < len(employees); i++ {
		if err := tx.Model(&model.Employee{}).Update("office_id", offices[i%len(employees)].ID).Error; err != nil {
			return err
		}
	}
	return nil
}

func (o *OfficeRepository) GetOfficesByLocation(ctx context.Context, offices *[]model.Office, limit, offset int, location string) error {
	return o.db.WithContext(ctx).Offset(offset).Limit(limit).Where("location LIKE '%?%'", location).Find(offices).Error
}

func (o *OfficeRepository) GetOfficesByCompanyID(ctx context.Context, offices *[]model.Office, id string, limit, offset int) error {
	return o.db.WithContext(ctx).Offset(offset).Limit(limit).Where("company_id = ?", id).Find(offices).Error
}
