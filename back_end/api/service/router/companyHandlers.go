package router

import (
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Router) GetAllCompanies(c *gin.Context) {
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var companies []model.Company

	err = r.repository.CompanyRepository.GetAllCompanies(c.Request.Context(), &companies, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"companies": companies})
}

func (r *Router) GetCompanyByID(c *gin.Context) {
	id := c.Param(config.Id)
	var company model.Company

	err := r.repository.CompanyRepository.GetCompanyById(c.Request.Context(), &company, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"company": company})
}

func (r *Router) GetCompaniesByName(c *gin.Context) {
	name := c.Param("name")
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var companies []model.Company

	err = r.repository.CompanyRepository.GetCompaniesByName(c.Request.Context(), &companies, name, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"companies": companies})
}

func (r *Router) GetCompanyRevenue(c *gin.Context) {
	id := c.Param(config.Id)
	revenueRequest := model.RevenueRequest{}
	if err := c.ShouldBindJSON(&revenueRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	var company model.Company

	err := r.repository.CompanyRepository.
		GetCompanyWithRevenuePeriod(c.Request.Context(), &company, id, revenueRequest.StartDate, revenueRequest.EndDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"company": company})
}

func (r *Router) CreateCompany(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var company model.Company
	if err := c.ShouldBindJSON(&company); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.CompanyRepository.CreateCompany(c.Request.Context(), &company)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"company": company})
}

func (r *Router) UpdateCompany(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}
	id := c.Param(config.Id)

	var company model.Company
	if err := c.ShouldBindJSON(&company); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	company.ID = id
	err := r.repository.CompanyRepository.UpdateCompany(c.Request.Context(), &company)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"company": company})
}

func (r *Router) DeleteCompany(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}
	id := c.Param(config.Id)

	err := r.repository.CompanyRepository.DeleteCompany(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Company deleted successfully"})
}
