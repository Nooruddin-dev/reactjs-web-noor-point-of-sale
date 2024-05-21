
const VERSION = "1";
export const API_BASE_URL = 'https://localhost:7044'; //--Live: http://noornashad-001-site5.etempurl.com, Local: https://localhost:7044
export const API_URL = `${API_BASE_URL}/api/v${VERSION}`;
export const APP_BASE_URL = "http://localhost:3000/"; //--Live: http://noornashad-001-site1.etempurl.com/, Local: http://localhost:3000/

export const pageShowTimeDuration = 500;


export const controllerUrlExtensions = {
  COMMON: 'common',
  PRODUCTS_CATALOG: 'products-catalog',
  USERS: 'Users',
  SALES_MANAGEMENT: 'sales-management',
  SETTING: 'setting',
  CASHIER_MAIN: 'cashier-main',
  DISCOUNTS: 'discounts',
  DATA_ANALYTICS: 'data-analytics',
  SHIFT_MANAGEMENT: 'shift-management',

}

export const API_ENDPOINTS = {
  //--Common Controller APIs url
  DELETE_ANY_RECORD: `/${controllerUrlExtensions.COMMON}/delete-record`,
  GET_SITE_NOTIFICATIONS: `/${controllerUrlExtensions.COMMON}/get-site-notifications`,
  MARK_NOTIFICATION_AS_READ: `/${controllerUrlExtensions.COMMON}/mark-notification-as-read`,
  GET_PAYMENT_METHODS: `/${controllerUrlExtensions.COMMON}/get-payment-methods`,


  //--Users APIs urls
  USER_LOGIN: `/${controllerUrlExtensions.USERS}/user-login`,
  GET_ALL_BUSINESS_PARTNERS: `/${controllerUrlExtensions.USERS}/get-all-business-partners`,
  GET_ALL_COUNTRIES: `/${controllerUrlExtensions.USERS}/get-countries-list`,
  INSERT_UPDATE_BUSINESS_PARTNER: `/${controllerUrlExtensions.USERS}/insert-update-business-partner`,
  GET_USERS_TYPES: `/${controllerUrlExtensions.USERS}/get-users-types`,

  //--Products Catalog APIs url
  INSERT_UPDATE_PRODUCT_CATEGORY: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-product-category`,
  GET_PRODUCTS_MAPPED_ATTRIBUTES_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get_products_mapped_attributes_list`,
  GET_ATTRIBUTES_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-attributes-list`,
  GET_MANUFACTURER_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-manufacturer-list`,
  GET_SHIPPING_METHODS: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-shipping-methods`,
  GET_PRODUCT_TAGS: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-product-tags`,
  INSERT_UPDATE_PRODUCT_TAG: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-product-tag`,
  INSERT_UPDATE_PRODUCT_PRODUCT: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-product-product`,
  GET_PRODUCTS_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-products-list`,
  GET_PRODUCT_DETAIL_BY_ID: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get_product_detail_by_id`,
  GET_PRODUCTS_MAPPED_IMAGES: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get_products_mapped_images`,
  GET_COLORS_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-colors-list`,
  UPDATE_PRODUCT_IMAGE_COLOR_MAPPING: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/update-product-image-color-mapping`,
  INSERT_UPDATE_MANUFACTURER: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-manufacturer`,
  INSERT_UPDATE_COLOR: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-color`,
  GET_INVENTORY_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-inventory-list`,
  GET_PRODUCT_INVENTORY_ITEMS_BY_ID: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-product-inventory-items`,
  INSERT_UPDATE_INVENTORY_MAIN: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-inventory-main`,
  GET_WAREHOUSE_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-warehouses-list`,
  GET_INVENTORY_METHODS_LIST: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-inventory-methods-list`,
  INSERT_UPDATE_PRODUCT_ATTRIBUTES_INVENTORY_ITEMS: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-product-attribute-inventory`,
  INSERT_UPDATE_WAREHOUSE: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/insert-update-warehouse`,
  GET_PRODUCT_CATEGORIES: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get-product-categories`,
  GET_PRODUCT_ATTRIBUTES_VALUES_BY_ID: `/${controllerUrlExtensions.PRODUCTS_CATALOG}/get_product_attributes_values_by_id`,


  //--Sales Management APIs urls
  GET_ORDER_STATUS_TYPES: `/${controllerUrlExtensions.SALES_MANAGEMENT}/get-order-status-types`,

  //--Cashier main APIs urls
  GET_POINT_OF_sALE_CATEGORIES: `/${controllerUrlExtensions.CASHIER_MAIN}/get-point-of-sale-categories`,
  GET_POINT_OF_SALE_PRODUCTS: `/${controllerUrlExtensions.CASHIER_MAIN}/get-point-of-sale-products`,
  GET_POS_PRODUCT_DETAIL_BY_ID: `/${controllerUrlExtensions.CASHIER_MAIN}/get-pos-product_detail`,
  GET_PRODUCTS_LIST_BY_IDS: `/${controllerUrlExtensions.CASHIER_MAIN}/get-products-list-by-ids`,
  GET_CUSTOMER_INFO_POS_CART: `/${controllerUrlExtensions.CASHIER_MAIN}/get-customer-info-for-pos-cart`,
  POST_CUSTOMER_ORDER: `/${controllerUrlExtensions.CASHIER_MAIN}/post-customer-order`,
  GET_CASHIER_ORDERS_LIST: `/${controllerUrlExtensions.CASHIER_MAIN}/get-cashier-orders-list`,
  UPDATE_ORDER_STATUS: `/${controllerUrlExtensions.CASHIER_MAIN}/update-order-status`,
  GET_ORDER_DETAILS_BY_ID: `/${controllerUrlExtensions.CASHIER_MAIN}/get-order-details`,
  GET_ORDER_ITEM_VARIANTS_DETAILS: `/${controllerUrlExtensions.CASHIER_MAIN}/get-order-item-variants`,



  //--Setting controller APIs urls
  GET_TAX_CATEGORIES: `/${controllerUrlExtensions.SETTING}/get-tax-categories`,
  GET_TAX_RULES: `/${controllerUrlExtensions.SETTING}/get-tax-rules`,
  INSERT_UPDATE_TAX_RULE: `/${controllerUrlExtensions.SETTING}/insert-update-tax-rule`,


  //--Discounts controller APIs urls
  GET_DISCOUNTS_LIST: `/${controllerUrlExtensions.DISCOUNTS}/get-discounts-list`,
  GET_DISCOUNTS_TYPES_LIST: `/${controllerUrlExtensions.DISCOUNTS}/get-discount-types-list`,
  GET_DISCOUNTS_MAPPED_PRODUCTS: `/${controllerUrlExtensions.DISCOUNTS}/get-discounts-mapped-products`,
  GET_PRODUCTS_LIST_FOR_DISCOUNT: `/${controllerUrlExtensions.DISCOUNTS}/get-products-list-for-discount`,
  INSERT_UPDATE_DISCOUNT: `/${controllerUrlExtensions.DISCOUNTS}/insert-update-discount`,
  GET_DISCOUNT_DETAIL_BY_ID: `/${controllerUrlExtensions.DISCOUNTS}/get-discount-detail-by-id`,
  GET_DISCOUNTS_MAPPED_CATEGORIES: `/${controllerUrlExtensions.DISCOUNTS}/get-discounts-mapped-categories`,
  GET_CATEGORIES_LIST_FOR_DISCOUNT: `/${controllerUrlExtensions.DISCOUNTS}/get-categories-list-for-discount`,

  //--DataAnalytics controller APIs urls
  GET_TODAY_ACTIVE_ORDERS_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-today-active-orders`,
  GET_ORDERS_EARNING_THIS_MONTH_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-orders-earnings-this-month`,
  GET_TODAY_HERO_PRODUCT_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-today-hero-products`,
  GET_ALL_SUMMARY_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-overall-summary`,
  GET_MONTHLY_SALE_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-monthly-sales-data`,
  GET_TOP_SALE_PRODUCTS_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-top-sale-products`,
  GET_TOP_TREND_ANALYTICS: `/${controllerUrlExtensions.DATA_ANALYTICS}/get-top-trend-analytics`,

  //--ShiftManagement controller APIs urls
  GET_SHIFT_NAMES_LIST: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/get-shift-names-list`,
  INSERT_UPDATE_SHIFT_NAME: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/insert-update-shift-name`, 
  GET_SHIFT_TRANSACTION_TYPES: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/get-shift-transaction-types`,
  GET_SHIFT_CASH_DRAWER_RECONCILIATION_STATUSES: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/get-shift-cash-drawer-reconciliation-statuses`,
  GET_SHIFT_CASH_TRANSACTION_DATA: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/get-shift-cash-transaction-data`,
  GET_CASHIER_SHIFT_DRAWER_INFO: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/get-cashier-shift-drawer-info`,
  INSERT_UPDATE_CASHIER_SHIFT_DRAWER: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/insert-update-cashier-shift-drawer`,
  CHECK_IF_ACTIVE_SHIFT_EXISTS: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/check-if-any-active-shift-exits`,
  INSERT_UPDATE_CASH_DRAWER_TRANSACTION: `/${controllerUrlExtensions.SHIFT_MANAGEMENT}/insert-update-cashier-drawer-transaction`,

}

export const APP_BASIC_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  DefaultCurrencyCode: 'USD',
  DefaultCurrencySymbol: '$'
}

export const DEFAULT_APP_SETTINGS = {
  WALK_THROUGH_USER_NAME: 'walkthroughcustomer@gmail.com',
  WALK_THROUGH_USER_PASS: '123456',
  POS_PRODUCT_VIEW_TYPE: 'Detail'
}