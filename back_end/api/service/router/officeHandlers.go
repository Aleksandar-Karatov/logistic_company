package router

import (
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Router) GetAllOffices(c *gin.Context) {

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var offices []model.Office

	err = r.repository.OfficeRepository.GetAllOffices(&offices, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offices": offices})
}

func (r *Router) GetOfficeByID(c *gin.Context) {

	id := c.Param(config.Id)

	var office model.Office

	err := r.repository.OfficeRepository.GetOfficeById(&office, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"office": office})
}

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

	err := r.repository.OfficeRepository.CreateOffice(&office)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"office": office})
}

func (r *Router) UpdateOffice(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	var office model.Office

	if err := c.ShouldBindJSON(&office); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	office.ID = id
	err := r.repository.OfficeRepository.UpdateOffice(&office)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"office": office})
}

func (r *Router) DeleteOffice(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	err := r.repository.OfficeRepository.DeleteOffice(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Office deleted successfully"})
}

func (r *Router) GetOfficesByLocation(c *gin.Context) {

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	location := c.Param("location")
	var offices []model.Office

	err = r.repository.OfficeRepository.GetOfficesByLocation(&offices, limit, offset, location)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offices": offices})
}

func (r *Router) GetOfficesByCompanyID(c *gin.Context) {

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id := c.Param(config.Id)
	var offices []model.Office

	err = r.repository.OfficeRepository.GetOfficesByCompanyID(&offices, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offices": offices})
}
