package model

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RevenueRequest struct {
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}
