package repository

import (
	"context"
	"logistic_company/config"
	"logistic_company/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PackageRepository struct {
	db *gorm.DB
}

func NewPackageRepository(db *gorm.DB) *PackageRepository {
	return &PackageRepository{
		db: db,
	}
}

func (r *PackageRepository) GetAllPackages(ctx context.Context, packages *[]model.Package, limit, offset int) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Offset(offset).Limit(limit).Find(&packages).Error
}

func (r *PackageRepository) GetPackagesByCompanyID(ctx context.Context, packages *[]model.Package, id string, limit, offset int) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Where("company_id = ?", id).Offset(offset).Limit(limit).Find(&packages).Error
}

func (r *PackageRepository) GetPackagesBySenderID(ctx context.Context, packages *[]model.Package, id string, limit, offset int) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Where("sender_id = ?", id).Offset(offset).Limit(limit).Find(&packages).Error
}

func (r *PackageRepository) GetPackagesByReceiverID(ctx context.Context, packages *[]model.Package, id string, limit, offset int) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Where("receiver_id = ?", id).Offset(offset).Limit(limit).Find(packages).Error
}

func (r *PackageRepository) GetPackagesByEmployeeID(ctx context.Context, packages *[]model.Package, id string, limit, offset int) error {
	employeeRole := ""
	err := r.db.WithContext(ctx).Model(&model.Employee{}).Where("id = ?", id).Select("role").Find(&employeeRole).Error
	if err != nil {
		return err
	}
	filterColumn := ""
	if employeeRole == config.RoleCourrier {
		filterColumn = "courrier_id = ?"
	} else {
		filterColumn = "registered_by = ?"
	}

	return r.db.WithContext(ctx).Preload(clause.Associations).Where(filterColumn, id).Offset(offset).Limit(limit).Find(packages).Error
}

func (r *PackageRepository) GetNotDeliveredPackages(ctx context.Context, packages *[]model.Package, limit, offset int) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Where("delivery_date IS NULL").Offset(offset).Limit(limit).Find(packages).Error
}

func (r *PackageRepository) GetPackageById(ctx context.Context, packageModel *model.Package, id string) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Where("id = ?", id).First(packageModel).Error
}

func (r *PackageRepository) CreatePackage(ctx context.Context, packageModel *model.Package) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Model(&packageModel).Create(packageModel).Error
}

func (r *PackageRepository) UpdatePackage(ctx context.Context, packageModel *model.Package) error {
	return r.db.WithContext(ctx).Preload(clause.Associations).Model(&packageModel).Where("id = ?", packageModel.ID).Updates(packageModel).Error
}

func (r *PackageRepository) DeletePackage(ctx context.Context, packageModel *model.Package, id string) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(packageModel).Error
}
