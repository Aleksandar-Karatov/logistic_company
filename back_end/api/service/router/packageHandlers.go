package router

import (
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Router) GetAllPackages(c *gin.Context) {
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetAllPackages(&packages, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"packages": packages})
}

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

	err = r.repository.PackageRepository.GetPackagesBySenderID(&packages, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"packages": packages})
}

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

	err = r.repository.PackageRepository.GetPackagesByReceiverID(&packages, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"packages": packages})
}

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

	err = r.repository.PackageRepository.GetPackagesByEmployeeID(&packages, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"packages": packages})
}

func (r *Router) GetNotDeliveredPackages(c *gin.Context) {
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var packages []model.Package

	err = r.repository.PackageRepository.GetNotDeliveredPackages(&packages, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"packages": packages})
}

func (r *Router) GetPackageByID(c *gin.Context) {
	id := c.Param(config.Id)

	var packageModel model.Package

	err := r.repository.PackageRepository.GetPackageById(&packageModel, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"package": packageModel})
}

func (r *Router) CreatePackage(c *gin.Context) {
	var packageModel model.Package
	role, _ := c.Get(config.Role)

	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&packageModel); err != nil {
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

	packageModel.DeliveryStatus = "created"
	packageModel.Price *= packageModel.Weight

	err := r.repository.PackageRepository.CreatePackage(&packageModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"package": packageModel})
}

func (r *Router) UpdatePackage(c *gin.Context) {
	var packageModel model.Package
	role, _ := c.Get(config.Role)

	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&packageModel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.PackageRepository.UpdatePackage(&packageModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"package": packageModel})
}

func (r *Router) DeletePackage(c *gin.Context) {
	var packageModel model.Package
	role, _ := c.Get(config.Role)

	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	err := r.repository.PackageRepository.DeletePackage(&packageModel, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Package deleted successfully"})
}
