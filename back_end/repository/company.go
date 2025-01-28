package repository

import (
	"context"
	"logistic_company/model"

	"gorm.io/gorm/clause"

	"gorm.io/gorm"
)

type CompanyRepository struct {
	db *gorm.DB
}

func NewCompanyRepository(db *gorm.DB) *CompanyRepository {
	return &CompanyRepository{
		db: db,
	}
}

func (c *CompanyRepository) GetAllCompanies(ctx context.Context, companies *[]model.Company, limit, offset int) error {
	return c.db.WithContext(ctx).Limit(limit).Offset(offset).Find(companies).Error
}

func (c *CompanyRepository) GetCompaniesByName(ctx context.Context, companies *[]model.Company, name string, limit, offset int) error {
	return c.db.WithContext(ctx).Limit(limit).Offset(offset).Where("name LIKE '%?%'", name).Find(companies).Error
}

func (c *CompanyRepository) GetCompanyById(ctx context.Context, company *model.Company, id string) error {
	return c.db.WithContext(ctx).Where("id = ?", id).First(company).Error
}

func (c *CompanyRepository) GetCompanyWithRevenuePeriod(ctx context.Context, company *model.Company, id string, startDate, endDate string) error {

	err := c.db.WithContext(ctx).Where("id = ?", id).First(company).Error
	if err != nil {
		return err
	}

	err = c.db.WithContext(ctx).Model(&model.Package{}).
		Where("company_id = ? AND delivery_date BETWEEN ? AND ?", id, startDate, endDate).
		Select("SUM(revenue) as revenue").
		First(&company.Revenue).Error

	return err
}

func (c *CompanyRepository) CreateCompany(ctx context.Context, company *model.Company) error {
	return c.db.WithContext(ctx).Model(&company).Create(company).Error
}

func (c *CompanyRepository) UpdateCompany(ctx context.Context, company *model.Company) error {
	return c.db.WithContext(ctx).Model(&company).Save(company).Error
}

func (c *CompanyRepository) DeleteCompany(ctx context.Context, id string) error {
	return c.db.WithContext(ctx).
		Model(&model.Company{}).Clauses(clause.OnConflict{UpdateAll: true}).
		Where("id = ?", id).Delete(&model.Company{}).Error
}
