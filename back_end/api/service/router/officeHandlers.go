package router

import (
	"encoding/json"
	"io"
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary Get all offices
// @Description Get all offices
// @Tags Office
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Office
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office [get]
// @Security BearerAuth
func (r *Router) GetAllOffices(c *gin.Context) {

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var offices []model.Office

	err = r.repository.OfficeRepository.GetAllOffices(c.Request.Context(), &offices, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, offices)
}

// @Summary Get office by id
// @Description Get office by id
// @Tags Office
// @Accept json
// @Produce json
// @Param id path string true "Office ID"
// @Success 200 {object} model.Office
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office/{id} [get]
// @Security BearerAuth
func (r *Router) GetOfficeByID(c *gin.Context) {

	id := c.Param(config.Id)

	var office model.Office

	err := r.repository.OfficeRepository.GetOfficeById(c.Request.Context(), &office, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, office)
}

// @Summary Create office
// @Description Create office
// @Tags Office
// @Accept json
// @Produce json
// @Param office body model.Office true "Office details"
// @Success 201 {object} model.Office
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office [post]
// @Security BearerAuth
func (r *Router) CreateOffice(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var office model.Office

	if err := c.ShouldBindJSON(&office); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.OfficeRepository.CreateOffice(c.Request.Context(), &office)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, office)
}

// @Summary Update office
// @Description Update office
// @Tags Office
// @Accept json
// @Produce json
// @Param id path string true "Office ID"
// @Param office body model.Office true "Office details"
// @Success 200 {object} model.Office
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office/{id} [patch]
// @Security BearerAuth
func (r *Router) UpdateOffice(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	var office model.Office

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err = json.Unmarshal(body, &office)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	office.ID = id
	err = r.repository.OfficeRepository.UpdateOffice(c.Request.Context(), &office)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, office)
}

// @Summary Delete office
// @Description Delete office
// @Tags Office
// @Accept json
// @Produce json
// @Param id path string true "Office ID"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office/{id} [delete]
// @Security BearerAuth
func (r *Router) DeleteOffice(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	err := r.repository.OfficeRepository.DeleteOffice(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Office deleted successfully"})
}

// @Summary Get offices by location
// @Description Get offices by location
// @Tags Office
// @Accept json
// @Produce json
// @Param location path string true "Location"
// @Success 200 {object} []model.Office
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office/location/{location} [get]
// @Security BearerAuth
func (r *Router) GetOfficesByLocation(c *gin.Context) {

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	location := c.Param("location")
	var offices []model.Office

	err = r.repository.OfficeRepository.GetOfficesByLocation(c.Request.Context(), &offices, limit, offset, location)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, offices)
}

// @Summary Get offices by company id
// @Description Get offices by company id
// @Tags Office
// @Accept json
// @Produce json
// @Param id path string true "Company ID"
// @Success 200 {object} []model.Office
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/office/company/{id} [get]
// @Security BearerAuth
func (r *Router) GetOfficesByCompanyID(c *gin.Context) {

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id := c.Param(config.Id)
	var offices []model.Office

	err = r.repository.OfficeRepository.GetOfficesByCompanyID(c.Request.Context(), &offices, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, offices)
}
