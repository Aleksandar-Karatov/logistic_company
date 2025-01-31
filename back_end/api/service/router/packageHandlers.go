package router

import (
	"encoding/json"
	"io"
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// @Summary Get all packages
// @Description Get all packages
// @Tags Package
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package [get]
// @Security BearerAuth
func (r *Router) GetAllPackages(c *gin.Context) {
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetAllPackages(c.Request.Context(), &packages, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packages)
}

// @Summary Get packages by sender id
// @Description Get packages by sender id
// @Tags Package
// @Accept json
// @Produce json
// @Param id path string true "Sender ID"
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package/sender/{id} [get]
// @Security BearerAuth
func (r *Router) GetPackagesBySenderID(c *gin.Context) {
	contextID, _ := c.Get(config.Id)
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != id {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetPackagesBySenderID(c.Request.Context(), &packages, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packages)
}

// @Summary Get packages by receiver id
// @Description Get packages by receiver id
// @Tags Package
// @Accept json
// @Produce json
// @Param id path string true "Receiver ID"
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package/receiver/{id} [get]
// @Security BearerAuth
func (r *Router) GetPackagesByReceiverID(c *gin.Context) {
	contextID, _ := c.Get(config.Id)
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != id {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetPackagesByReceiverID(c.Request.Context(), &packages, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packages)
}

// @Summary Get packages by employee id
// @Description Get packages by employee id
// @Tags Package
// @Accept json
// @Produce json
// @Param id path string true "Employee ID"
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package/employee/{id} [get]
// @Security BearerAuth
func (r *Router) GetPackagesByEmployeeID(c *gin.Context) {
	contextID, _ := c.Get(config.Id)
	role, _ := c.Get(config.Role)
	id := c.Param(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != id {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetPackagesByEmployeeID(c.Request.Context(), &packages, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packages)
}

// @Summary Get not delivered packages
// @Description Get not delivered packages
// @Tags Package
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package/not-delivered [get]
// @Security BearerAuth
func (r *Router) GetNotDeliveredPackages(c *gin.Context) {
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetNotDeliveredPackages(c.Request.Context(), &packages, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packages)
}

// @Summary Get package by id
// @Description Get package by id
// @Tags Package
// @Accept json
// @Produce json
// @Param id path string true "Package ID"
// @Success 200 {object} model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package/{id} [get]
// @Security BearerAuth
func (r *Router) GetPackageByID(c *gin.Context) {
	id := c.Param(config.Id)

	var packageModel model.Package

	err := r.repository.PackageRepository.GetPackageById(c.Request.Context(), &packageModel, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packageModel)
}

// @Summary Create package
// @Description Create package
// @Tags Package
// @Accept json
// @Produce json
// @Param package body model.Package true "Package"
// @Success 200 {object} model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package [post]
// @Security BearerAuth
func (r *Router) CreatePackage(c *gin.Context) {
	var packageModel model.Package
	role, _ := c.Get(config.Role)

	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&packageModel); err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if packageModel.IsDeliveredToOffice {
		if packageModel.OfficeDeliveredAtID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Office ID is required"})
			return
		}
		packageModel.Price = config.DeliveryToOfficePricePerKillogram
	} else {
		packageModel.Price = config.DeliveryToAddressPricePerKillogram
	}

	packageModel.Price *= packageModel.Weight

	err := r.repository.PackageRepository.CreatePackage(c.Request.Context(), &packageModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, packageModel)
}

// @Summary Update package
// @Description Update package
// @Tags Package
// @Accept json
// @Produce json
// @Param package body model.Package true "Package"
// @Success 200 {object} model.Package
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package [patch]
// @Security BearerAuth
func (r *Router) UpdatePackage(c *gin.Context) {
	var packageModel model.Package
	role, _ := c.Get(config.Role)

	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err = json.Unmarshal(body, &packageModel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err = r.repository.PackageRepository.UpdatePackage(c.Request.Context(), &packageModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, packageModel)
}

// @Summary Delete package
// @Description Delete package
// @Tags Package
// @Accept json
// @Produce json
// @Param id path string true "Package ID"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/package/{id} [delete]
// @Security BearerAuth
func (r *Router) DeletePackage(c *gin.Context) {
	var packageModel model.Package
	role, _ := c.Get(config.Role)

	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	err := r.repository.PackageRepository.DeletePackage(c.Request.Context(), &packageModel, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Package deleted successfully"})
}
