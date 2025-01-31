package router

import (
	"encoding/json"
	"io"
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary Get all employees
// @Description Get all employees
// @Tags Employee
// @Accept json
// @Produce json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} []model.Employee
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee [get]
// @Security BearerAuth
func (r *Router) GetAllEmployees(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleEmployee && role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var employees []model.Employee

	err = r.repository.EmployeeRepository.GetAllEmployees(c.Request.Context(), &employees, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employees)
}

// @Summary Get employee by ID
// @Description Get employee by ID
// @Tags Employee
// @Accept json
// @Produce json
// @Param id path string true "Employee ID"
// @Success 200 {object} model.Employee
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee/{id} [get]
// @Security BearerAuth
func (r *Router) GetEmployeeByID(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleEmployee && role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)
	var employee model.Employee

	err := r.repository.EmployeeRepository.GetEmployeeById(c.Request.Context(), &employee, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employee)
}

// @Summary Create employee
// @Description Create employee
// @Tags Employee
// @Accept json
// @Produce json
// @Param employee body model.Employee true "Employee details"
// @Success 201 {object} model.Employee
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee [post]
// @Security BearerAuth
func (r *Router) CreateEmployee(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var employee model.EmployeeRegister

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.EmployeeRepository.CreateEmployee(c.Request.Context(), &employee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, employee.Employee)
}

// @Summary Get employees by company ID
// @Description Get employees by company ID
// @Tags Employee
// @Accept json
// @Produce json
// @Param id path string true "Company ID"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} []model.Employee
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee/company/{id} [get]
// @Security BearerAuth
func (r *Router) GetEmployeesByCompanyID(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleEmployee && role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var employees []model.Employee

	err = r.repository.EmployeeRepository.GetEmployeesByCompanyID(c.Request.Context(), &employees, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employees)
}

// @Summary Get employees by name
// @Description Get employees by name
// @Tags Employee
// @Accept json
// @Produce json
// @Param name path string true "Name"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} []model.Employee
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee/search/{name} [get]
// @Security BearerAuth
func (r *Router) GetEmployeesByName(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleEmployee && role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	name := c.Param("name")
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var employees []model.Employee

	err = r.repository.EmployeeRepository.GetEmployeesByName(c.Request.Context(), &employees, name, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employees)
}

// @Summary Update employee
// @Description Update employee
// @Tags Employee
// @Accept json
// @Produce json
// @Param id path string true "Employee ID"
// @Param employee body model.Employee true "Employee details"
// @Success 200 {object} model.Employee
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee/{id} [patch]
// @Security BearerAuth
func (r *Router) UpdateEmployee(c *gin.Context) {
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	contextID, _ := c.Get(config.Id)

	if role != config.RoleAdmin && (role != config.RoleEmployee && contextID == id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var employee model.EmployeeRegister
	employee.ID = id
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	err = json.Unmarshal(body, &employee)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err = r.repository.EmployeeRepository.UpdateEmployee(c.Request.Context(), &employee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employee.Employee)
}

// @Summary Delete employee
// @Description Delete employee
// @Tags Employee
// @Accept json
// @Produce json
// @Param id path string true "Employee ID"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/employee/{id} [delete]
// @Security BearerAuth
func (r *Router) DeleteEmployee(c *gin.Context) {
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && (role != config.RoleEmployee && contextID == id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	err := r.repository.EmployeeRepository.DeleteEmployee(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}
