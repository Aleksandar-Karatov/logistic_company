package repository

import (
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

func (e *EmployeeRepository) GetAllEmployees(employees *[]model.Employee, limit, offset int) error {
	return e.db.Model(&model.Employee{}).Limit(limit).Offset(offset).Find(employees).Error
}

func (e *EmployeeRepository) GetEmployeesByName(employees *[]model.Employee, name string, limit, offset int) error {
	return e.db.Model(&model.Employee{}).Limit(limit).Offset(offset).Where("name LIKE '%?%'", name).Find(employees).Error
}

func (e *EmployeeRepository) GetEmployeesByCompanyID(employees *[]model.Employee, id string, limit, offset int) error {
	return e.db.Model(&model.Employee{}).Limit(limit).Offset(offset).Where("company_id = ?", id).Find(employees).Error
}

func (e *EmployeeRepository) GetEmployeeById(employee *model.Employee, id string) error {
	return e.db.Model(&employee).Where("id = ?", id).Find(employee).Error
}

func (e *EmployeeRepository) CreateEmployee(employee *model.Employee) error {
	return e.db.Model(&employee).Create(employee).Error
}

func (e *EmployeeRepository) UpdateEmployee(employee *model.Employee) error {
	return e.db.Model(&employee).Updates(employee).Error
}

func (e *EmployeeRepository) DeleteEmployee(id string) error {
	tx := e.db.Begin()
	//TODO: UPDATE ALL PACKAGES WITH RANDOM EMPLOYEE (asignee and courrier)
	err := tx.Model(&model.Package{}).Where("employee_id = ?", id).Delete(&model.Package{}).Error

	return tx.Model(&model.Employee{}).Clauses(clause.OnConflict{UpdateAll: true}).Where("id = ?", id).Delete(&model.Employee{}).Error
}
