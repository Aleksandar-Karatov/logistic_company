package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Package struct {
	ID                  string     `gorm:"primaryKey;type:varchar(255)" json:"id"`
	SenderID            string     `gorm:"column:sender_id;not null;type:varchar(255)" json:"senderID" binding:"required"`
	Sender              *Client    `gorm:"foreignKey:SenderID" json:"sender"`
	ReceiverID          string     `gorm:"column:receiver_id;not null;type:varchar(255)" json:"receiverID" binding:"required"`
	Receiver            *Client    `gorm:"foreignKey:ReceiverID" json:"receiver"`
	Weight              float64    `gorm:"column:weight;not null;type:float(8)" json:"weight" binding:"required"`
	Price               float64    `gorm:"column:price;not null;type:float(8)" json:"price"`
	IsDeliveredToOffice bool       `gorm:"column:is_delivered_to_office;not null;type:bool" json:"isDeliveredToOffice" binding:"required"`
	DeliveryStatus      string     `gorm:"column:delivery_status;not null;type:varchar(255)" json:"deliveryStatus"`
	DeliveryDate        *time.Time `gorm:"column:delivery_date;type:datetime" json:"deliveryDate"`

	RegisteredByID string    `gorm:"column:registered_by;type:varchar(255)" json:"registeredByID" binding:"required"`
	RegisteredBy   *Employee `gorm:"foreignKey:RegisteredByID" json:"registeredBy"`
	CourrierID     string    `gorm:"column:courrier_id;not null;type:varchar(255)" json:"courrierID" binding:"required"`
	Courrier       *Employee `gorm:"foreignKey:CourrierID" json:"courrier"`

	OfficeAcceptedAtID string  `gorm:"column:office_accepted_at;not null;type:varchar(255)" json:"officeAcceptedAtID" binding:"required"`
	OfficeAcceptedAt   *Office `gorm:"foreignKey:OfficeAcceptedAtID" json:"officeAcceptedAt"`

	DeliveryLocation *string `gorm:"column:delivery_location;type:varchar(255)" json:"deliveryLocation" binding:"required"`

	OfficeDeliveredAtID string   `gorm:"column:office_delivered_at;type:varchar(255)" json:"officeDeliveredAtID" binding:"required"`
	OfficeDeliveredAt   *Office  `gorm:"foreignKey:OfficeDeliveredAtID" json:"officeDeliveredAt"`
	CompanyID           string   `gorm:"column:company_id;not null;type:varchar(255)" json:"companyID" binding:"required"`
	Company             *Company `gorm:"foreignKey:CompanyID" json:"company"`
}

func (Package) TableName() string {
	return "package"
}

func (p *Package) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = uuid.New().String()
	return nil
}
