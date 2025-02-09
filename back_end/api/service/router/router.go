package router

import (
	_ "logistic_company/api/docs"
	"logistic_company/api/service/auth"
	"logistic_company/config"
	"logistic_company/repository"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Router struct {
	repository *repository.Repository
	cfg        *config.Config
	ginEngine  *gin.Engine
	secretKey  []byte
}

func NewRouter(repository *repository.Repository, cfg *config.Config) (r *Router, err error) {
	r = &Router{repository: repository,
		cfg:       cfg,
		ginEngine: gin.Default()}
	r.secretKey = []byte(cfg.JWTSecretKey)
	r.InitializeRoutes()
	return r, nil
}

func (r *Router) InitializeRoutes() {
	c := cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                            // Or your frontend URL(s)
		AllowMethods:     []string{"POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"}, // Allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},          // Allowed headers
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true, // If you need credentials (cookies, authorization headers)
		AllowOriginFunc: func(origin string) bool {
			// Add custom logic here if you need it
			return origin == "http://localhost:3000"
		},
		// MaxAge: 12 * time.Hour, // Optional
	})
	r.ginEngine.Use(c)

	r.ginEngine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	api := r.ginEngine.Group("/api")
	{
		api.POST("/login", r.Login)
		api.POST("/logout", r.Logout)
		api.POST("/client/register", r.CreateClient)
		v1 := api.Group("/v1", auth.JWTMiddleware(r.repository, r.secretKey))
		{
			v1.GET("/user-info", r.UserInfo)
			companyApi := v1.Group("/company")
			{
				companyApi.GET("", r.GetAllCompanies)
				companyApi.GET("/:id", r.GetCompanyByID)
				companyApi.GET("/search/:name", r.GetCompaniesByName)
				companyApi.POST("/:id/revenue", r.GetCompanyRevenue)
				companyApi.POST("", r.CreateCompany)
				companyApi.PATCH(":id", r.UpdateCompany)
				companyApi.DELETE(":id", r.DeleteCompany)
			}

			employeeApi := v1.Group("/employee")
			{
				employeeApi.GET("", r.GetAllEmployees)
				employeeApi.GET("/company/:id", r.GetEmployeesByCompanyID)
				employeeApi.GET("/search/:name", r.GetEmployeesByName)
				employeeApi.GET("/:id", r.GetEmployeeByID)
				employeeApi.POST("", r.CreateEmployee)
				employeeApi.PATCH("/:id", r.UpdateEmployee)
				employeeApi.DELETE("/:id", r.DeleteEmployee)

			}

			officeApi := v1.Group("/office")
			{
				officeApi.GET("", r.GetAllOffices)
				officeApi.GET("/location/:location", r.GetOfficesByLocation)
				officeApi.GET("/company/:id", r.GetOfficesByCompanyID)
				officeApi.GET("/:id", r.GetOfficeByID)
				officeApi.POST("", r.CreateOffice)
				officeApi.PATCH("/:id", r.UpdateOffice)
				officeApi.DELETE("/:id", r.DeleteOffice)
			}

			packageApi := v1.Group("/package")
			{
				packageApi.GET("", r.GetAllPackages)
				packageApi.GET("/sender/:id", r.GetPackagesBySenderID)
				packageApi.GET("/receiver/:id", r.GetPackagesByReceiverID)
				packageApi.GET("/employee/:id", r.GetPackagesByEmployeeID)
				packageApi.GET("/not_delivered", r.GetNotDeliveredPackages)
				packageApi.GET("/:id", r.GetPackageByID)
				packageApi.POST("", r.CreatePackage)
				packageApi.PATCH("/:id", r.UpdatePackage)
				packageApi.DELETE("/:id", r.DeletePackage)
			}

			clientApi := v1.Group("/client")
			{
				clientApi.GET("", r.GetAllClients)
				clientApi.GET("/company/:id", r.GetClientsByCompanyID)
				clientApi.GET("/search/:name", r.GetClientsByName)
				clientApi.GET("/:id", r.GetClientByID)
				clientApi.PATCH("/:id", r.UpdateClient)
				clientApi.DELETE("/:id", r.DeleteClient)
			}
		}
	}
}

func (r *Router) Run() error {
	return r.ginEngine.Run(r.cfg.APIhost + ":" + r.cfg.APIport)
}
