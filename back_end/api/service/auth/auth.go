package auth

import (
	"fmt"
	"log"
	"logistic_company/config"
	"logistic_company/model"
	"logistic_company/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

type CustomClaims struct {
	ID                   string `json:"id"`
	Email                string `json:"email"`
	Role                 string `json:"role"`
	jwt.RegisteredClaims        // The embedded struct for RegisteredClaims should work fine.
}

func JWTMiddleware(repos *repository.Repository, secretKey []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the token from the Authorization header
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Remove 'Bearer ' prefix if it exists
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		// Parse and validate the JWT token
		token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			// Ensure the signing method is HS256
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				log.Printf("Unexpected signing method: %v", token.Header["alg"])
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})
		if err != nil {
			log.Printf("Error parsing token: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Extract claims from the token
		claims, ok := token.Claims.(*CustomClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		if claims.Role == config.RoleClient {
			var client model.Client
			err := repos.ClientRepository.GetClientByID(c.Request.Context(), &client, claims.ID)
			if err != nil {
				log.Printf("Error getting client: %v", err)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
				c.Abort()
				return
			}
			c.Set(config.Id, client.ID)
			c.Set(config.Role, config.RoleClient)
			c.Set(config.Email, client.Email)
		} else if claims.Role == config.RoleEmployee || claims.Role == config.RoleAdmin || claims.Role == config.RoleCourrier {
			var employee model.Employee
			err := repos.EmployeeRepository.GetEmployeeById(c.Request.Context(), &employee, claims.ID)
			if err != nil {
				log.Printf("Error getting employee: %v", err)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
				c.Abort()
				return
			}
			c.Set(config.Id, employee.ID)
			c.Set(config.Email, employee.Email)
			c.Set(config.Role, employee.Role)

		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid role :D"})
			c.Abort()
			return
		}

		c.Next()
	}
}
