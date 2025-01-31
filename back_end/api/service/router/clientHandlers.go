package router

import (
	"encoding/json"
	"io"
	"logistic_company/config"
	"logistic_company/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary Get all clients
// @Description Get all clients
// @Security BearerAuth
// @Tags Client
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Client
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/client [get]
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

	err = r.repository.ClientRepository.GetAllClients(c.Request.Context(), &clients, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clients)
}

// @Summary Get clients by company id
// @Description Get clients by company id
// @Tags Client
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Client
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/client/company/{id} [get]
// @Security BearerAuth
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

	err = r.repository.ClientRepository.GetClientsByCompanyID(c.Request.Context(), &clients, id, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clients)
}

// @Summary Get clients by name
// @Description Get clients by name
// @Tags Client
// @Accept json
// @Produce json
// @Param limit query int false "limit"
// @Param offset query int false "offset"
// @Success 200 {object} []model.Client
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/client/search/{name} [get]
// @Security BearerAuth
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

	err = r.repository.ClientRepository.GetClientsByName(c.Request.Context(), &clients, name, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clients)
}

// @Summary Get client by id
// @Description Get client by id
// @Tags Client
// @Accept json
// @Produce json
// @Param id path string true "Client ID"
// @Success 200 {object} model.Client
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/client/{id} [get]
// @Security BearerAuth
func (r *Router) GetClientByID(c *gin.Context) {
	role, _ := c.Get(config.Role)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != c.Param(config.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)
	var client model.Client

	err := r.repository.ClientRepository.GetClientByID(c.Request.Context(), &client, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, client)
}

// @Summary Create client
// @Description Create client
// @Tags Client
// @Accept json
// @Produce json
// @Param client body model.Client true "Client"
// @Success 201 {object} model.ClientRegister
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/client/register [post]
func (r *Router) CreateClient(c *gin.Context) {
	var client model.ClientRegister
	if err := c.ShouldBindJSON(&client); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err := r.repository.ClientRepository.CreateClient(c.Request.Context(), &client)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, client.Client)
}

// @Summary Update client
// @Description Update client
// @Tags Client
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param Authorization header string true "Authorization"
// @Param id path string true "Client ID"
// @Param client body model.Client true "Client"
// @Success 200 {object} model.Client
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/client/{id} [patch]
// @Security BearerAuth
func (r *Router) UpdateClient(c *gin.Context) {
	role, _ := c.Get(config.Role)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != c.Param(config.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	var client model.ClientRegister
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	err = json.Unmarshal(body, &client)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	err = r.repository.ClientRepository.UpdateClient(c.Request.Context(), &client)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, client.Client)
}

// @Summary Delete client
// @Description Delete client
// @Tags Client
// @Accept json
// @Produce json
// @Param id path string true "Client ID"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /api/v1/client/{id} [delete]
// @Security BearerAuth
func (r *Router) DeleteClient(c *gin.Context) {
	role, _ := c.Get(config.Role)
	contextID, _ := c.Get(config.Id)
	if role != config.RoleAdmin && role != config.RoleEmployee && contextID != c.Param(config.Id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param(config.Id)

	err := r.repository.ClientRepository.DeleteClient(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Client deleted successfully"})
}
