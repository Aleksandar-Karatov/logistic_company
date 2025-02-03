package repository

import (
	"context"
	"errors"
	"logistic_company/config"
	"logistic_company/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type EmployeeRepository struct {
	db *gorm.DB
}

func NewEmployeeRepository(db *gorm.DB) *EmployeeRepository {
	return &EmployeeRepository{
		db: db,
	}
}

func (e *EmployeeRepository) GetAllEmployees(ctx context.Context, employees *[]model.Employee, limit, offset int) error {
	return e.db.WithContext(ctx).Preload(clause.Associations).Model(&model.Employee{}).Limit(limit).Offset(offset).Find(employees).Error
}

func (e *EmployeeRepository) GetEmployeesByName(ctx context.Context, employees *[]model.Employee, name string, limit, offset int) error {
	return e.db.WithContext(ctx).Preload(clause.Associations).Model(&model.Employee{}).Limit(limit).Offset(offset).Where("name LIKE '%?%'", name).Find(employees).Error
}

func (e *EmployeeRepository) GetEmployeesByCompanyID(ctx context.Context, employees *[]model.Employee, id string, limit, offset int) error {
	return e.db.WithContext(ctx).Preload(clause.Associations).Model(&model.Employee{}).Limit(limit).Offset(offset).Where("company_id = ?", id).Find(employees).Error
}

func (e *EmployeeRepository) GetEmployeeById(ctx context.Context, employee *model.Employee, id string) error {
	return e.db.WithContext(ctx).Preload(clause.Associations).Model(&employee).Where("id = ?", id).Find(employee).Error
}

func (e *EmployeeRepository) CreateEmployee(ctx context.Context, employee *model.EmployeeRegister) error {
	return e.db.WithContext(ctx).Preload(clause.Associations).Model(&employee).Create(employee).Error
}

func (e *EmployeeRepository) UpdateEmployee(ctx context.Context, employee *model.EmployeeRegister) error {
	return e.db.WithContext(ctx).Preload(clause.Associations).Model(&employee).Where("id = ?", employee.ID).Updates(employee).Error
}

func (e *EmployeeRepository) DeleteEmployee(ctx context.Context, id string) error {
	tx := e.db.WithContext(ctx).Begin()
	employee := model.Employee{}

	err := tx.Model(&model.Employee{}).Where("id = ?", id).First(&employee).Error
	if err != nil {
		tx.Rollback()
		return err
	}
	if employee.Role == config.RoleAdmin {
		tx.Rollback()
		return errors.New("can't delete admin")
	} else {
		if err := e.reassignCourrierPackages(tx, &employee); err != nil {
			tx.Rollback()
			return err
		}
	}

	err = tx.Model(&model.Employee{}).Clauses(clause.OnConflict{UpdateAll: true}).
		Where("id = ?", id).Delete(&model.Employee{}).Error

	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

func (e *EmployeeRepository) reassignCourrierPackages(tx *gorm.DB, employee *model.Employee) error {
	packages := []model.Package{}

	if err := tx.Model(&model.Package{}).Where("courrier_id = ?", employee.ID).Find(&packages).Error; err != nil {
		return err
	}

	employees := []model.Employee{}
	err := e.db.Model(&model.Employee{}).
		Where("role = ?", employee.Role).
		Where("id <> ?", employee.ID).
		Where("company_id = ?", employee.CompanyID).
		Order("RANDOM()").Limit(len(packages)).Find(&employees).Error
	if err != nil {
		return err
	}

	if len(employees) == 0 {
		return errors.New("no courriers available")
	}

	columnToUpdate := ""
	if employee.Role == config.RoleCourrier {
		columnToUpdate = "courrier_id"
	} else {
		columnToUpdate = "registered_by"
	}

	for i := 0; i < len(packages); i++ {
		if err := tx.Model(&model.Package{}).
			Clauses(clause.OnConflict{UpdateAll: true}).
			Where("id = ?", packages[i].ID).Update(columnToUpdate, employees[i%len(packages)].ID).Error; err != nil {
			return err
		}
	}

	return nil
}
