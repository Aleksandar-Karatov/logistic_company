package router

import (
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

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

	err = r.repository.EmployeeRepository.GetAllEmployees(&employees, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employees": employees})
}

func (r *Router) GetEmployeeByID(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleEmployee && role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)
	var employee model.Employee

	err := r.repository.EmployeeRepository.GetEmployeeById(&employee, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employee": employee})
}

func (r *Router) CreateEmployee(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var employee model.Employee

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.EmployeeRepository.CreateEmployee(&employee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"employee": employee})
}

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

	err = r.repository.EmployeeRepository.GetEmployeesByCompanyID(&employees, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employees": employees})
}

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

	err = r.repository.EmployeeRepository.GetEmployeesByName(&employees, name, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employees": employees})
}

func (r *Router) UpdateEmployee(c *gin.Context) {
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	contextID, _ := c.Get(config.Id)

	if role != config.RoleAdmin && (role != config.RoleEmployee && contextID == id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var employee model.Employee
	employee.ID = id
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.EmployeeRepository.UpdateEmployee(&employee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employee": employee})
}

func (r *Router) DeleteEmployee(c *gin.Context) {
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && (role != config.RoleEmployee && contextID == id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	err := r.repository.EmployeeRepository.DeleteEmployee(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}
