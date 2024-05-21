const dBEntitiesConst: any = {
    ProductCategories: {
      tableName: "ProductCategories",
      primaryKeyColumnName: "CategoryID",
    },
    Attachments: {
      tableName: "Attachments",
      primaryKeyColumnName: "AttachmentID",
    },
    Product_ProductAttribute_Mapping: {
      tableName: "Product_ProductAttribute_Mapping",
      primaryKeyColumnName: "ProductAttributeMappingID",
    },
    ProductTags: {
      tableName: "ProductTags",
      primaryKeyColumnName: "TagId",
    },
    Products: {
      tableName: "Products",
      primaryKeyColumnName: "ProductId",
    },

    ProductPicturesMapping: {
      tableName: "ProductPicturesMapping",
      primaryKeyColumnName: "ProductPictureMappingID",
    },
    Manufacturers: {
      tableName: "Manufacturers",
      primaryKeyColumnName: "ManufacturerID",
    },
    Colors: {
      tableName: "Colors",
      primaryKeyColumnName: "ColorID",
    },
    Warehouses: {
      tableName: "Warehouses",
      primaryKeyColumnName: "WarehouseId",
    },

    BusnPartner: {
      tableName: "BusnPartner",
      primaryKeyColumnName: "BusnPartnerId",
    },
    TaxRules: {
      tableName: "TaxRules",
      primaryKeyColumnName: "TaxRuleId",
    },

    Discounts: {
      tableName: "Discounts",
      primaryKeyColumnName: "DiscountID",
    },
    DiscountProductsMapping: {
      tableName: "DiscountProductsMapping",
      primaryKeyColumnName: "DiscountProductMappingID",
    },

    DiscountCategoriesMapping: {
      tableName: "DiscountCategoriesMapping",
      primaryKeyColumnName: "DiscountCategoryMappingId",
    },

    SiteGeneralNotifications: {
      tableName: "SiteGeneralNotifications",
      primaryKeyColumnName: "NotificationID",
    },

    ShiftNames: {
      tableName: "ShiftNames",
      primaryKeyColumnName: "ShiftNameId",
    },

    ShiftCashDrawer: {
      tableName: "ShiftCashDrawer",
      primaryKeyColumnName: "ShiftCashDrawerId",
    },
    ShiftCashTransactions: {
      tableName: "ShiftCashTransactions",
      primaryKeyColumnName: "TransactionId",
    },

  };
  
  export default dBEntitiesConst;

  