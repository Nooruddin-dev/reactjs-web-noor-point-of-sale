
import { API_ENDPOINTS } from "../../constants/Config";
import apiRequest from "./axiosHelper";

export const getProductCategories = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_CATEGORIES}?${queryUrl}`
    );
}

export const deletAnyRecordApi = (deleteParam: any) => {

    return apiRequest.delete(
        `${API_ENDPOINTS.DELETE_ANY_RECORD}/${deleteParam?.entityName}/${deleteParam?.entityColumnName}/${deleteParam?.entityRowId}/${deleteParam?.sqlDeleteTypeId}`
    );
}

export const getUserLoginApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.USER_LOGIN, body);
};

export const getProductCategoriesApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_CATEGORIES}?${queryUrl}`
    );
}
export const insertUpdateProductCategoryApi = (body: any) => {

    //  return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCT_CATEGORY, body);
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCT_CATEGORY, body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

};

export const getProductsMappedAttributesListApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_MAPPED_ATTRIBUTES_LIST}?${queryUrl}`
    );
}

export const getProductAttributesDropdownListApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_ATTRIBUTES_LIST}?${queryUrl}`
    );
}

export const getManufacturerListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_MANUFACTURER_LIST}?${queryUrl}`
    );
}
export const getVendorsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_BUSINESS_PARTNERS}?${queryUrl}`
    );
}
export const getProductAttributeValuesByAttributeIDApi = (productAttributeId: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_ATTRIBUTES_VALUES_BY_ID}/${productAttributeId}`
    );
}

export const GetShippingMethodsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SHIPPING_METHODS}?${queryUrl}`
    );
}


export const getProductTagsApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_TAGS}?${queryUrl}`
    );
}

export const insertUpdateProductTagApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCT_TAG, body);

};

export const insertUpdateProductApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCT_PRODUCT, body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

};

export const getProductsListApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_LIST}?${queryUrl}`
    );
}

export const getProductDetailByIdApi = (productId: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_DETAIL_BY_ID}/${productId}`
    );
}

export const getProductMappedImagesListApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_MAPPED_IMAGES}?${queryUrl}`
    );
}

export const getColorsListServiceApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_COLORS_LIST}?${queryUrl}`
    );
}

export const updateProductImgColorMappingApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.UPDATE_PRODUCT_IMAGE_COLOR_MAPPING, body);

};

export const insertUpdateManufacturerApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_MANUFACTURER, body);

};

export const insertUpdateColorApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_COLOR, body);
};

export const getInventoryListApi = (queryUrl: string) => {
    
    return apiRequest.get(
        `${API_ENDPOINTS.GET_INVENTORY_LIST}?${queryUrl}`
    );
}

export const GetProductInventoryItemsByIdApi = (inventoryId: number, productId: number) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_INVENTORY_ITEMS_BY_ID}/${inventoryId}/${productId}`
    );
}

export const insertUpdateInventoryMainApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_INVENTORY_MAIN, body);

};

export const getWarehousesListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_WAREHOUSE_LIST}?${queryUrl}`
    );
}

export const getInvnetoryMethodsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_INVENTORY_METHODS_LIST}?${queryUrl}`
    );
}

export const insertUpdateProductAttributesInventoryItemsApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCT_ATTRIBUTES_INVENTORY_ITEMS, body);

};

export const insertUpdateWarehouseApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_WAREHOUSE, body);

};

export const getOrderStatusTypesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ORDER_STATUS_TYPES}?${queryUrl}`
    );
}

export const getAllUsersApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_BUSINESS_PARTNERS}?${queryUrl}`
    );
}
export const getAllCountriesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_COUNTRIES}?${queryUrl}`
    );
}

export const inserUpdateBusinessPartnerApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_BUSINESS_PARTNER, body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

};

export const getTaxCategoriesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TAX_CATEGORIES}?${queryUrl}`
    );
}

export const getTaxRulesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TAX_RULES}?${queryUrl}`
    );
}

export const insertUpdateTaxRuleApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_TAX_RULE, body);
};

export const getPointOfSaleCategoriesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_POINT_OF_sALE_CATEGORIES}?${queryUrl}`
    );
}

export const getPointOfSaleAllProductsApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_POINT_OF_SALE_PRODUCTS}?${queryUrl}`
    );
}

export const getProductDetailForPointOfSaleByIdApi = (productId: number) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_POS_PRODUCT_DETAIL_BY_ID}/${productId}`
    );
}

export const getProductsListByProductIdsApi = (productIdsString: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_LIST_BY_IDS}/${productIdsString}`
    );
}


export const getCustomerInfoPointOfSaleCartApi = (searchByCustomerId: number, SearchKeyword: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_CUSTOMER_INFO_POS_CART}?SearchKeyword=${SearchKeyword}&CustomerId=${searchByCustomerId}`
    );
}

export const postCustomerOrderApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.POST_CUSTOMER_ORDER, body);

};


export const getCashierOrdersListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_CASHIER_ORDERS_LIST}?${queryUrl}`
    );
}

export const updateOrderStatusApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.UPDATE_ORDER_STATUS, body);

};

export const getOrderDetailsByIdApi = (orderId: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ORDER_DETAILS_BY_ID}/${orderId}`
    );
}


export const gerOrderItemVariantsDetailsApi = (orderId: any, orderItemId: number) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ORDER_ITEM_VARIANTS_DETAILS}/${orderId}/${orderItemId}`
    );
}

export const getDiscountsListApi = (queryUrl: string) => {

    return apiRequest.get(
        `${API_ENDPOINTS.GET_DISCOUNTS_LIST}?${queryUrl}`
    );
}

export const getDiscountsTypesListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_DISCOUNTS_TYPES_LIST}?${queryUrl}`
    );
}

export const getDiscountsMappedProductsApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_DISCOUNTS_MAPPED_PRODUCTS}?${queryUrl}`
    );
}
export const getProductsListForDiscountApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_LIST_FOR_DISCOUNT}?${queryUrl}`
    );
}

export const insertUpdateDiscountApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_DISCOUNT, body);

};


export const getDiscountDetailByIdApi = (discountId: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_DISCOUNT_DETAIL_BY_ID}/${discountId}`
    );
}

export const getDiscountsMappedCategoriesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_DISCOUNTS_MAPPED_CATEGORIES}?${queryUrl}`
    );
}

export const getCategoriesListForDiscountApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_CATEGORIES_LIST_FOR_DISCOUNT}?${queryUrl}`
    );
}

export const getTodayActiveOrdersAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TODAY_ACTIVE_ORDERS_ANALYTICS}`
    );
}

export const getOrdersEarningThisMonthAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ORDERS_EARNING_THIS_MONTH_ANALYTICS}`
    );
}

export const getTodayHeroProductsAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TODAY_HERO_PRODUCT_ANALYTICS}`
    );
}

export const getOverAllSummaryAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_SUMMARY_ANALYTICS}`
    );
}


export const getMonthlySaleAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_MONTHLY_SALE_ANALYTICS}`
    );
}


export const getTopSaleProductsAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TOP_SALE_PRODUCTS_ANALYTICS}`
    );
}

export const getTopTrendsAnalyticsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TOP_TREND_ANALYTICS}`
    );
}

export const getSiteGeneralNotificationsApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SITE_NOTIFICATIONS}?${queryUrl}`
    );
}

export const getPaymentMethodsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PAYMENT_METHODS}?${queryUrl}`
    );
}


export const markNotificationAsReadApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.MARK_NOTIFICATION_AS_READ, body);
};

export const getUserTypesListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_USERS_TYPES}?${queryUrl}`
    );
}



export const insertUpdateShiftNameApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_SHIFT_NAME, body);
};

export const getShiftNameListServiceApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SHIFT_NAMES_LIST}?${queryUrl}`
    );
}


export const getShiftCashTransactionTypesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SHIFT_TRANSACTION_TYPES}?${queryUrl}`
    );
}
export const getShiftCashDrawerReconciliationStatusesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SHIFT_CASH_DRAWER_RECONCILIATION_STATUSES}?${queryUrl}`
    );
}

export const getShiftCashTransactionDataApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SHIFT_CASH_TRANSACTION_DATA}?${queryUrl}`
    );
}
export const getCashierShiftDrawerInfoApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_CASHIER_SHIFT_DRAWER_INFO}?${queryUrl}`
    );
}


export const insertUpdateCashierShiftDrawerApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_CASHIER_SHIFT_DRAWER, body);
};

export const checkIfAnyActiveShiftExistsApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.CHECK_IF_ACTIVE_SHIFT_EXISTS}`
    );
}

export const insertUpdateCashDrawerTransactionApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_CASH_DRAWER_TRANSACTION, body);
};
