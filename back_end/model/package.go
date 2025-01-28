package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Package struct {
	ID                  string     `gorm:"primaryKey;type:varchar(255)"`
	SenderID            string     `gorm:"column:client_id;not null;type:varchar(255)"`
	Sender              *Client    `gorm:"foreignKey:SenderID"`
	ReceiverID          string     `gorm:"column:receiver_id;not null;type:varchar(255)"`
	Receiver            *Client    `gorm:"foreignKey:ReceiverID"`
	Weight              float64    `gorm:"column:weight;not null;type:float(8)"`
	Price               float64    `gorm:"column:price;not null;type:float(8)"`
	IsDeliveredToOffice bool       `gorm:"column:is_delivered_to_office;not null;type:bool"`
	DeliveryStatus      string     `gorm:"column:delivery_status;not null;type:varchar(255)"`
	DeliveryDate        *time.Time `gorm:"column:delivery_date;type:datetime"`

	RegisteredByID string    `gorm:"column:registered_by;type:varchar(255)"`
	RegisteredBy   *Employee `gorm:"foreignKey:RegisteredByID"`
	CourrierID     string    `gorm:"column:courrier_id;not null;type:varchar(255)"`
	Courrier       *Employee `gorm:"foreignKey:CourrierID"`

	OfficeAcceptedAtID string  `gorm:"column:office_accepted_at;not null;type:varchar(255)"`
	OfficeAcceptedAt   *Office `gorm:"foreignKey:OfficeAcceptedAtID"`

	DeliveryLocation *string `gorm:"column:delivery_location;type:varchar(255)"`

	OfficeDeliveredAtID string  `gorm:"column:office_delivered_at;type:varchar(255)"`
	OfficeDeliveredAt   *Office `gorm:"foreignKey:OfficeDeliveredAtID"`
}

func (Package) TableName() string {
	return "package"
}

func (p *Package) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = uuid.New().String()
	return nil
}
