package repository

import (
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

func (c *CompanyRepository) GetAllCompanies(companies *[]model.Company, limit, offset int) error {
	return c.db.Limit(limit).Offset(offset).Find(companies).Error
}

func (c *CompanyRepository) GetCompaniesByName(companies *[]model.Company, name string, limit, offset int) error {
	return c.db.Limit(limit).Offset(offset).Where("name LIKE '%?%'", name).Find(companies).Error
}

func (c *CompanyRepository) GetCompanyById(company *model.Company, id string) error {
	return c.db.Where("id = ?", id).First(company).Error
}

func (c *CompanyRepository) GetCompanyWithRevenuePeriod(company *model.Company, id string, startDate, endDate string) error {

	err := c.db.Where("id = ?", id).First(company).Error
	if err != nil {
		return err
	}

	err = c.db.Model(&model.Package{}).
		Where("company_id = ? AND delivery_date BETWEEN ? AND ?", id, startDate, endDate).
		Select("SUM(revenue) as revenue").
		First(&company.Revenue).Error

	return err
}

func (c *CompanyRepository) CreateCompany(company *model.Company) error {
	return c.db.Model(&company).Create(company).Error
}

func (c *CompanyRepository) UpdateCompany(company *model.Company) error {
	return c.db.Model(&company).Save(company).Error
}

func (c *CompanyRepository) DeleteCompany(id string) error {
	return c.db.Model(&model.Company{}).Clauses(clause.OnConflict{UpdateAll: true}).Where("id = ?", id).Delete(&model.Company{}).Error
}
