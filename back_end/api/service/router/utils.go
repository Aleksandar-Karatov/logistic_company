package router

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func extractPagination(c *gin.Context) (limit, offset int, err error) {
	limit, err = strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil {
		return
	}
	offset, err = strconv.Atoi(c.DefaultQuery("offset", "0"))

	return
}
