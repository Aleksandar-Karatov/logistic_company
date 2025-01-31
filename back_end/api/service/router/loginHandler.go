package router

import (
	"fmt"
	"net/http"
	"time"

	"logistic_company/api/service/auth"
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

	c.JSON(http.StatusOK, gin.H{"token": "Bearer " + tokenString})
}
