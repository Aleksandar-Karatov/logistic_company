package router

import (
	"fmt"
	"net/http"
	"time"

	"logistic_company/api/service/auth"
	"logistic_company/config"
	"logistic_company/model"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// @Summary Login
// @Description Logs in a user
// @Tags login
// @Accept json
// @Produce json
// @Param payload body model.LoginPayload true "Login payload"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Router /api/login [post]
func (r *Router) Login(c *gin.Context) {
	var payload model.LoginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Authenticate user
	if payload.Email == "" || payload.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}

	id, role, err := r.repository.LoginRepository.Login(c.Request.Context(), payload.Email, payload.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}
	claims := auth.CustomClaims{
		ID:    id,
		Email: payload.Email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "logistic_company",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), // Token expires in 24 hours
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	fmt.Println("SECRET KEY: ", string(r.secretKey))
	tokenString, err := token.SignedString(r.secretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, map[string]string{"token": "Bearer " + tokenString,
		"role":  claims.Role,
		"email": claims.Email},
	)
}

// @Summary Get user info
// @Description Get user info
// @Tags login
// @Accept json
// @Produce json
// @Success 200 {object} map[string]string
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Router /api/v1/user-info [get]
// @Security BearerAuth
func (r *Router) UserInfo(c *gin.Context) {
	role, _ := c.Get(config.Role)
	id, _ := c.Get(config.Id)
	email, _ := c.Get(config.Email)
	userInfo := map[string]string{
		config.Role:  role.(string),
		config.Id:    id.(string),
		config.Email: email.(string),
	}
	c.JSON(http.StatusOK, userInfo)
}

// @Summary Logout
// @Description Logs out a user
// @Tags login
// @Accept json
// @Produce json
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Router /api/logout [post]
// @Security BearerAuth
func (r *Router) Logout(c *gin.Context) {
	c.Header("Authorization", "")
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}
