package router

import (
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Router) GetAllClients(c *gin.Context) {

	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var clients []model.Client

	err = r.repository.ClientRepository.GetAllClients(&clients, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"clients": clients})
}

func (r *Router) GetClientsByCompanyID(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var clients []model.Client

	err = r.repository.ClientRepository.GetClientsByCompanyID(&clients, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"clients": clients})
}

func (r *Router) GetClientsByName(c *gin.Context) {
	role, _ := c.Get(config.Role)
	if role != config.RoleAdmin && role != config.RoleEmployee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	name := c.Param("name")
	limit, offset, err := extractPagination(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var clients []model.Client

	err = r.repository.ClientRepository.GetClientsByName(&clients, name, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"clients": clients})
}

func (r *Router) GetClientByID(c *gin.Context) {
	role, _ := c.Get(config.Role)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != c.Param(config.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)
	var client model.Client

	err := r.repository.ClientRepository.GetClientByID(&client, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"client": client})
}

func (r *Router) CreateClient(c *gin.Context) {
	var client model.Client
	if err := c.ShouldBindJSON(&client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.ClientRepository.CreateClient(&client)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"client": client})
}

func (r *Router) UpdateClient(c *gin.Context) {
	role, _ := c.Get(config.Role)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != c.Param(config.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var client model.Client
	if err := c.ShouldBindJSON(&client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.ClientRepository.UpdateClient(&client)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"client": client})
}

func (r *Router) DeleteClient(c *gin.Context) {
	role, _ := c.Get(config.Role)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != c.Param(config.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	err := r.repository.ClientRepository.DeleteClient(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Client deleted successfully"})
}
