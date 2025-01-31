package router

import (
	"encoding/json"
	"io"
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary Get all companies
// @Description Get all companies
// @Tags Company
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Company
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company [get]
// @Security BearerAuth
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

	c.JSON(http.StatusOK, companies)
}

// @Summary Get company by id
// @Description Get company by id
// @Tags Company
// @Accept json
// @Produce json
// @Param id path string true "Company ID"
// @Success 200 {object} model.Company
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company/{id} [get]
// @Security BearerAuth
func (r *Router) GetCompanyByID(c *gin.Context) {
	id := c.Param(config.Id)
	var company model.Company

	err := r.repository.CompanyRepository.GetCompanyById(c.Request.Context(), &company, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, company)
}

// @Summary Get companies by name
// @Description Get companies by name
// @Tags Company
// @Accept json
// @Produce json
// @Param name path string true "Company name"
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Company
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company/search/{name} [get]
// @Security BearerAuth
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

	c.JSON(http.StatusOK, companies)
}

// @Summary Get company revenue
// @Description Get company revenue
// @Tags Company
// @Accept json
// @Produce json
// @Param id path string true "Company ID"
// @Param start_date query string true "Start date"
// @Param end_date query string true "End date"
// @Success 200 {object} model.Company
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company/{id}/revenue [get]
// @Security BearerAuth
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

	c.JSON(http.StatusOK, company)
}

// @Summary Create company
// @Description Create company
// @Tags Company
// @Accept json
// @Produce json
// @Param company body model.Company true "Company details"
// @Success 201 {object} model.Company
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company [post]
// @Security BearerAuth
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

	c.JSON(http.StatusCreated, company)
}

// @Summary Update company
// @Description Update company
// @Tags Company
// @Accept json
// @Produce json
// @Param id path string true "Company ID"
// @Param company body model.Company true "Company details"
// @Success 200 {object} model.Company
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company/{id} [patch]
// @Security BearerAuth
func (r *Router) UpdateCompany(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}
	id := c.Param(config.Id)

	var company model.Company
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	err = json.Unmarshal(body, &company)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	company.ID = id
	err = r.repository.CompanyRepository.UpdateCompany(c.Request.Context(), &company)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, company)
}

// @Summary Delete company
// @Description Delete company
// @Tags Company
// @Accept json
// @Produce json
// @Param id path string true "Company ID"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/company/{id} [delete]
// @Security BearerAuth
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
