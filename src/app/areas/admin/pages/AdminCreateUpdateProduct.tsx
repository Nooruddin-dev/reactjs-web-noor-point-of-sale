/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminPageHeader from '../components/layout/AdminPageHeader'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import { KTCard, KTCardBody } from '../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../common/components/CommonListSearchHeader'
import SiteErrorMessage from '../../common/components/SiteErrorMessage'
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import AdminProductAttributesList from '../components/productsCataglog/AdminProductAttributesList'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import { GetShippingMethodsListApi, getManufacturerListApi, getProductAttributeValuesByAttributeIDApi, getProductAttributesDropdownListApi, getProductCategoriesApi, getProductDetailByIdApi, getProductTagsApi, getProductsMappedAttributesListApi, getTaxRulesApi, getVendorsListApi, insertUpdateProductApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import BusinessPartnerTypesEnum from '../../../../_poscommon/common/enums/BusinessPartnerTypesEnum'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper'
import { useNavigate, useParams } from 'react-router'
import AdminProductsMappedImages from '../components/productsCataglog/AdminProductsMappedImages'
import { faCircleInfo, faImage, faListCheck, faTags, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { taxRulesTypesConst } from '../../../../_poscommon/common/enums/GlobalEnums'



type FormInputs = {
  ProductName: string;
  ShortDescription: string;
  ManufacturerId: number;
  FullDescription: string;
  VendorId: number;
  SelectedCategoryIds: any;
  SelectedTagIds: any;
  Sku: string;
  IsActive: any;
  MarkAsNew: any;
  AllowCustomerReviews: any;
  Price: number;
  OldPrice: number;
  IsDiscountAllowed: any;
  IsShippingFree: any;
  SelectedShippingMethodIds: any;
  TaxRuleId: number,
  EstimatedShippingDays: any;
  ShippingCharges: number;
  IsReturnAble: any;

  productAttributeId: string;
  PriceAdjustmentType: string;
  PriceAdjustment: string;
  AttributeValue: string;

}




export default function AdminCreateUpdateProduct() {
  const navigate = useNavigate();
  const [defaultValuesEdit, setDefaultValuesEdit] = useState<any>({}); // Data of the category being edited
  const [productMappedAttributes, setProductMappedAttributes] = useState<any>([]);
  const [manufacturersList, setManufacturersList] = useState<any>([]);
  const [allTaxRules, setAllTaxRules] = useState<any>([]);
  const [productCategoriesList, setProductCategoriesList] = useState<any>([]);
  const [optionsCategoriesList, setOptionsCategoriesList] = useState([]);
  const [productTagsOptions, setProductTagsOptions] = useState([]);
  const [shippingMethodsOptions, setShippingMethodsOptions] = useState<any>([]);
  const [vendorsList, setVendorsList] = useState<[]>([]);
  const [attributesDropdown, setAttributesDropdown] = useState<any>([]);
  const [selectedProductAttributeValues, setSelectedProductAttributeValues] = useState<any>([]);
  const { control, register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<FormInputs>();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [listAttributeRefreshCounter, setListAttributeRefreshCounter] = useState<number>(0);
  const [productImages, setProductImages] = useState([]);
  const [productDetailById, setProductDetailById] = useState<any>({});


  const params = useParams();
  const productId = params?.productId ?? '0';
  const [pageBasicInfoAttribute, setPageBasicInfoAttribute] = useState<any>(
    {
      productId: productId,
      pageNo: 1,
      pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
      totalRecords: 0
    }
  );
  const [isFreeShippingChecked, setIsFreeShippingChecked] = useState(false);


  const handleOnDeleteAttributeClick = (rowId: number) => {
    //setListAttributeRefreshCounter(prevCounter => prevCounter + 1);

    // Filter out the row with the specified ProductAttributeMappingID
    const updatedAttributes = productMappedAttributes.filter(
      (row: any) => row.productAttributeMappingID !== rowId
    );

    //-- Update the state with the filtered array
    setProductMappedAttributes(updatedAttributes);
  }


  const handleGoToPageAttribute = (page: number) => {

    //--reset pageNo to param page value
    setPageBasicInfoAttribute((prevPageBasicInfo: any) => ({
      ...prevPageBasicInfo,
      pageNo: page // Update only the pageNo property
    }));
    setListAttributeRefreshCounter(prevCounter => prevCounter + 1);
  };

  const handleIsFreeShippingCheckboxChange = (event: any) => {

    const isChecked = event?.target?.checked;
    setIsFreeShippingChecked(isChecked);
    if (isChecked == true) {
      setValue('ShippingCharges', 0);
    }
  };

  const handleImageChange = (e: any) => {
    //--First empty the array

    const files: any = Array.from(e.target.files);

    setProductImages(files);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
  };


  const onSubmitCategoryForm = (data: any) => {

    const { ProductName, ShortDescription, ManufacturerId, FullDescription, VendorId, SelectedCategoryIds, SelectedTagIds, Sku, IsActive, MarkAsNew,
      AllowCustomerReviews, Price, OldPrice, IsDiscountAllowed, IsShippingFree, SelectedShippingMethodIds, TaxRuleId, EstimatedShippingDays, ShippingCharges,
      IsReturnAble } = data;

    if (!data) {
      showErrorMsg('No valid data. Please try again');
      return false;
    }

    var productFormData = new FormData();

    for (var i = 0; i < productImages.length; i++) {
      productFormData.append("ProductImages", productImages[i]);
    }
    productFormData.append("ProductId", productId ?? 0);
    productFormData.append("ProductName", ProductName ?? '');
    productFormData.append("ShortDescription", ShortDescription ?? '');
    productFormData.append("FullDescription", FullDescription ?? '');
    productFormData.append("ManufacturerId", ManufacturerId ?? 0);
    productFormData.append("VendorId", VendorId ?? 0);
    productFormData.append("IsActive", IsActive ?? true);
    productFormData.append("MarkAsNew", MarkAsNew ?? false);
    productFormData.append("AllowCustomerReviews", AllowCustomerReviews ?? false);
    productFormData.append("Sku", Sku ?? '');
    productFormData.append("Price", Price ?? 0);
    productFormData.append("OldPrice", OldPrice ?? 0);
    productFormData.append("IsDiscountAllowed", IsDiscountAllowed ?? false);
    productFormData.append("IsShippingFree", IsShippingFree ?? false);
    productFormData.append("TaxRuleId", TaxRuleId ?? 0);
    productFormData.append("ShippingCharges", ShippingCharges ?? 0);
    productFormData.append("EstimatedShippingDays", EstimatedShippingDays ?? 1);
    productFormData.append("IsReturnAble", IsReturnAble ?? false);


    //--Get categories id in json
    if (SelectedCategoryIds && SelectedCategoryIds.length > 0) {
      const SelectedCategoryIdsArray = SelectedCategoryIds.map((item: { value: any }) => item.value);
      productFormData.append("SelectedCategoryIdsJson", JSON.stringify(SelectedCategoryIdsArray));
    } else {
      productFormData.append("SelectedCategoryIdsJson", '[]');
    }


    //--Get tags id in json
    if (SelectedTagIds && SelectedTagIds.length > 0) {
      const SelectedTagIdsArray = SelectedTagIds.map((item: { value: any }) => item.value);
      productFormData.append("SelectedTagsJson", JSON.stringify(SelectedTagIdsArray));
    } else {
      productFormData.append("SelectedTagsJson", '[]');
    }


    //--Get shipping methods id in json
    if (SelectedShippingMethodIds && SelectedShippingMethodIds.length > 0) {
      const SelectedShippingMethodIdsArray = SelectedShippingMethodIds.map((item: { value: any }) => item.value);
      productFormData.append("SelectedShippingMethodsJson", JSON.stringify(SelectedShippingMethodIdsArray));
    } else {
      productFormData.append("SelectedShippingMethodsJson", '[]');
    }


    if (productMappedAttributes && productMappedAttributes.length > 0) {
      productFormData.append("ProductAttributesJson", JSON.stringify(productMappedAttributes));
    } else {
      productFormData.append("ProductAttributesJson", '[]');
    }


    insertUpdateProductApi(productFormData)
      .then((res: any) => {

        if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
          showSuccessMsg("Saved Successfully!");
          //--clear form
          setTimeout(() => {

            navigate('/admin/products');

          }, 500);

        } else {
          showErrorMsg("An error occured. Please try again!");
        }


      })
      .catch((err: any) => {
        console.error(err, "err");
        showErrorMsg("An error occured. Please try again!");
      });


    // reset(); // Clear the form after submission
  };



  // Set initial form values or you can use below code to update form fields in case of edit
  //  useEffect(() => {
  //   const initialData = {}
  //   if (initialData) {
  //     Object.entries(initialData).forEach(([key, value]) => {
  //       setValue(key, value);
  //     });
  //   }
  // }, [setValue]);


  useEffect(() => {
    getProductsMappedAttributesListService();
  }, [listAttributeRefreshCounter]);

  const getProductsMappedAttributesListService = () => {

    const pageBasicInfoParams = new URLSearchParams(pageBasicInfoAttribute).toString();

    getProductsMappedAttributesListApi(pageBasicInfoParams)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          const totalRecords = data[0]?.totalRecords;
          setPageBasicInfoAttribute((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            totalRecords: totalRecords
          }));

          setProductMappedAttributes(res?.data);
        }


      })
      .catch((err: any) => console.log(err, "err"));
  };


  const GetProductAttributeValuesByAttributeID = (event: any) => {

    const productAttributeIdChange = event?.target?.value;

    if (stringIsNullOrWhiteSpace(productAttributeIdChange)) {
      setSelectedProductAttributeValues([]);
      return false;
    }

    getProductAttributeValuesByAttributeIDApi(productAttributeIdChange)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          setSelectedProductAttributeValues(res?.data);
        }

      })
      .catch((err: any) => console.log(err, "err"));

  }

  const AddProductAttributeRow = () => {
    const { productAttributeId, PriceAdjustmentType, PriceAdjustment, AttributeValue } = getValues();
    let ProductAttributeIdText = attributesDropdown?.find((a: { productAttributeId: string }) => a.productAttributeId == productAttributeId)?.displayName;
    let AttributeValueText = selectedProductAttributeValues?.find((a: { displayValue: string }) => a.displayValue == AttributeValue)?.displayText;
    let PriceAdjustmentTypeText = (PriceAdjustmentType && PriceAdjustmentType == '1') ? 'Fixed Value' : 'Percentage'


    if (stringIsNullOrWhiteSpace(productAttributeId)) {
      showErrorMsg("Please select product attribute!");
      return false;
    }
    if (stringIsNullOrWhiteSpace(PriceAdjustmentType)) {
      showErrorMsg("Please select price adjustment type!");
      return false;
    }
    if (stringIsNullOrWhiteSpace(AttributeValue)) {
      showErrorMsg("Please select attribute value type!");
      return false;
    }

    let isExists = productMappedAttributes?.filter((x: {
      attributeValue: any, productAttributeID: string
    }) => x.productAttributeID == productAttributeId && x.attributeValue == AttributeValue)?.length > 0;

    if (isExists) {
      showErrorMsg('This attribute already exists!');
      return false;
    } else {


      const minValueForRandom = -1;
      const maxValueForRandom = -100;

      const randomProductAttributeIdRaw = Math.floor(Math.random() * (maxValueForRandom - minValueForRandom + 1)) + minValueForRandom;
      let attributeToAdd = {
        productAttributeMappingID: randomProductAttributeIdRaw,
        productAttributeID: productAttributeId,
        attributeName: ProductAttributeIdText,
        priceAdjustmentType: PriceAdjustmentType,
        priceAdjustment: PriceAdjustment,
        attributeValue: AttributeValue,
        attributeDisplayText: AttributeValueText,
        displayName: ProductAttributeIdText,

      }
      setProductMappedAttributes((prevState: any) => [...prevState, attributeToAdd]);
    }

  }


  useEffect(() => {

    if (productDetailById != null && productDetailById != undefined) {
      //--set selectedCategoryIds
      if ((productDetailById.selectedCategoriesJson) && (optionsCategoriesList && optionsCategoriesList.length > 0)) {
        let categoriesResponse = JSON.parse(productDetailById.selectedCategoriesJson ?? '[]');
        const selectedCategoryIdsFromDetail = categoriesResponse?.map((item: any) => ({
          value: item.CategoryID ?? 0,
          label: item.Name
        }));
        setValue('SelectedCategoryIds', selectedCategoryIdsFromDetail);

      }

      //--set SelectedTagIds
      if ((productDetailById.selectedTagsJson) && (productTagsOptions && productTagsOptions.length > 0)) {
        let tagsResponse = JSON.parse(productDetailById.selectedTagsJson ?? '[]');

        const SelectedTagIdsFromDetail = tagsResponse?.map((item: any) => ({
          value: item.TagID ?? 0,
          label: item.TagName
        }));
        setValue('SelectedTagIds', SelectedTagIdsFromDetail);


      }

      //--set SelectedShippingMethodIds
      if ((productDetailById.selectedShippingMethodsJson) && (shippingMethodsOptions && shippingMethodsOptions.length > 0)) {
        let shippingMethodsResponse = JSON.parse(productDetailById.selectedShippingMethodsJson ?? '[]');

        const SelectedShippingMethodIdsFromDetail = shippingMethodsResponse?.map((item: any) => ({
          value: item.ShippingMethodID ?? 0,
          label: item.MethodName
        }));
        setValue('SelectedShippingMethodIds', SelectedShippingMethodIdsFromDetail);

      }

   
      //--set other fields
      setValue('ManufacturerId', productDetailById.manufacturerId);
      setValue('VendorId', productDetailById.vendorId);
      setValue('TaxRuleId', productDetailById.taxRuleId);
    }



  }, [productDetailById, optionsCategoriesList, productTagsOptions, shippingMethodsOptions]);

  // ✅ --One time API calss. Do not add any variable in dependency array of below useEffect()
  useEffect(() => {
    GetProductAttributesDropdownListService();
    getManufacturersListService();
    getVendorsListService();
    GetShippingMethodsListService();
    getProductCategoriesService();
    getProductTagsService();
    getProductDetailByIdService();
    getProductTaxRulesService();
  }, []);

  const GetProductAttributesDropdownListService = () => {

    const attributePageInfoRequst: any = {
      PageNo: 1,
      PageSize: 100
    }
    const attributePageInfoParam = new URLSearchParams(attributePageInfoRequst).toString();

    getProductAttributesDropdownListApi(attributePageInfoParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          setAttributesDropdown(res?.data);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };

  const getManufacturersListService = () => {

    const pageInfoManufacturerRequest: any = {
      PageNo: 1,
      PageSize: 100
    }
    const pageInfoManufacturerParam = new URLSearchParams(pageInfoManufacturerRequest).toString();

    getManufacturerListApi(pageInfoManufacturerParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          setManufacturersList(res?.data);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };

  const getVendorsListService = () => {

    const pageInfoManufacturerRequest: any = {
      PageNo: 1,
      PageSize: 100,
      BusnPartnerTypeId: BusinessPartnerTypesEnum.Vendor
    }
    const pageInfoManufacturerParam = new URLSearchParams(pageInfoManufacturerRequest).toString();

    getVendorsListApi(pageInfoManufacturerParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          setVendorsList(res?.data);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };


  const GetShippingMethodsListService = () => {

    const pageInfoShippingMethodsRequest: any = {
      PageNo: 1,
      PageSize: 100
    }
    const pageInfoShippingMethodsParam = new URLSearchParams(pageInfoShippingMethodsRequest).toString();

    GetShippingMethodsListApi(pageInfoShippingMethodsParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {

          const newOptions = res?.data?.map((item: any) => ({
            value: item.shippingMethodId ?? 0,
            label: item.methodName
          }));

          setShippingMethodsOptions(newOptions);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };

  const getProductCategoriesService = () => {

    const pageInfoProdCategoriesRequest: any = {
      PageNo: 1,
      PageSize: 300
    }
    const pageInfoProdCategoriesParam = new URLSearchParams(pageInfoProdCategoriesRequest).toString();

    getProductCategoriesApi(pageInfoProdCategoriesParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          setProductCategoriesList(res?.data);
          const newOptions = res?.data?.map((item: any) => ({
            value: item.categoryId ?? 0,
            label: `${!stringIsNullOrWhiteSpace(item.parentCategoryName) ? (item.parentCategoryName + ' >> ') : ''}${item.name}`
          }));

          setOptionsCategoriesList(newOptions);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };

  const getProductTagsService = () => {

    const pageInfoTagsRequest: any = {
      PageNo: 1,
      PageSize: 300
    }
    const pageInfoTagsParam = new URLSearchParams(pageInfoTagsRequest).toString();

    getProductTagsApi(pageInfoTagsParam)
      .then((res: any) => {

        const { data } = res;
        if (data && data.length > 0) {
          const newOptionsTags = res?.data?.map((item: any) => ({
            value: item.tagId ?? 0,
            label: item.tagName ?? ''

          }));

          setProductTagsOptions(newOptionsTags);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };

  const getProductTaxRulesService = () => {

    const pageInfoTaxRulesRequest: any = {
      PageNo: 1,
      PageSize: 200
    }
    const pageInfoTaxRulesParam = new URLSearchParams(pageInfoTaxRulesRequest).toString();

    getTaxRulesApi(pageInfoTaxRulesParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          setAllTaxRules(res?.data);

        } else {

        }


      })
      .catch((err: any) => console.log(err, "err"));
  };


  const getProductDetailByIdService = () => {

    getProductDetailByIdApi(productId)
      .then((res: any) => {
        const { data } = res;
        console.log('product detail: ', data);
        if (data) {
          setValue('ProductName', data.productName);
          setValue('ShortDescription', data.shortDescription);

          setValue('FullDescription', data.fullDescription);

          setValue('Sku', data.sku);
          setValue('IsActive', data.isActive);
          setValue('MarkAsNew', data.markAsNew);
          setValue('AllowCustomerReviews', data.allowCustomerReviews);
          setValue('Price', data.price);
          setValue('OldPrice', data.oldPrice);
          setValue('IsDiscountAllowed', data.isDiscountAllowed);
          setValue('IsShippingFree', data.isShippingFree);
          setValue('EstimatedShippingDays', data.estimatedShippingDays);
          setValue('ShippingCharges', data.shippingCharges);
          setValue('IsReturnAble', data.isReturnAble);

          setProductDetailById(data);

        }

      })
      .catch((err: any) => console.log(err, "err"));
  };


  return (
    <AdminLayout>
      <AdminPageHeader
        title='Create Product'
        pageDescription='Product Categories'
        addNewClickType={'link'}
        newLink={''}
        onAddNewClick={undefined}
        additionalInfo={{
          showAddNewButton: false
        }
        }
      />

      <Content>
        <KTCard>


          <KTCardBody className='py-4'>

            <form className='form w-100'
              onSubmit={(e) => {
                handleSubmit(onSubmitCategoryForm)(e);
                setFormSubmitted(true);
              }}
            >



              <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-6 fs-6 pb-4" style={{ borderBottom: '0px' }}>
                <li className="nav-item">
                  <a
                    className="nav-link active text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_1"
                  >
                    <FontAwesomeIcon icon={faCircleInfo} className='me-2' />
                    Product Basic Info
                  </a>

                </li>
                <li className="nav-item ">
                  <a
                    className="nav-link text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_2"
                  >
                    <FontAwesomeIcon icon={faTags} className='me-2' />
                    Prices
                  </a>
                </li>


                <li className="nav-item">
                  <a
                    className="nav-link text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_3"
                  >
                    <FontAwesomeIcon icon={faImage} className='me-2' />
                    Pictures
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_4"
                  >
                    <FontAwesomeIcon icon={faListCheck} className='me-2' />
                    Product Attributes
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_5"
                  >
                    <FontAwesomeIcon icon={faTruckFast} className='me-2' />
                    Shipping
                  </a>
                </li>


              </ul>



              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="kt_tab_pane_1"
                  role="tabpanel"
                >

                  <div className='row'>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required ">Product Name</label>
                        <input
                          type="text"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.ProductName ? 'is-invalid' : 'is-valid') : ''}`}
                          id="ProductName" {...register("ProductName", { required: true })}

                          placeholder="Enter product name"
                        />
                        {errors.ProductName && <SiteErrorMessage errorMsg='Product name is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required ">Short Desc</label>
                        <input
                          type="text"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.ShortDescription ? 'is-invalid' : 'is-valid') : ''}`}
                          id="ShortDescription" {...register("ShortDescription", { required: true })}

                          placeholder="Enter short desc"
                        />
                        {errors.ShortDescription && <SiteErrorMessage errorMsg='Description is required' />}
                      </div>
                    </div>


                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label">Manufacturer </label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.ManufacturerId ? 'is-invalid' : 'is-valid') : ''}`}

                          aria-label="Select example"
                          id="ManufacturerId" {...register("ManufacturerId", { required: false })}
                        >

                          <option value=''>--Select--</option>

                          {manufacturersList?.map((item: any, index: any) => (
                            <option key={index} value={item.manufacturerId}>
                              {item.name}
                            </option>
                          ))}

                        </select>

                      </div>
                    </div>



                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Full Desc</label>
                        <textarea
                          className={`form-control form-control-solid ${formSubmitted ? (errors.FullDescription ? 'is-invalid' : 'is-valid') : ''}`}
                          id="FullDescription" {...register("FullDescription", { required: false })} rows={3}>

                        </textarea>


                        {errors.FullDescription && <SiteErrorMessage errorMsg='Full description is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required">Vendor </label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.VendorId ? 'is-invalid' : 'is-valid') : ''}`}

                          aria-label="Select example"
                          id="VendorId" {...register("VendorId", { required: true })}
                        >
                          <option value=''>--Select--</option>
                          {vendorsList?.map((item: any, index: any) => (
                            <option key={index} value={item.busnPartnerId}>
                              {item.firstName} {item.lastName}
                            </option>
                          ))}

                        </select>
                        {errors.VendorId && <SiteErrorMessage errorMsg='Vendor is required' />}
                      </div>
                    </div>


                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required">Categories </label>
                        {/* <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.ProductCategories ? 'is-invalid' : 'is-valid') : ''}`}
                          multiple 
                          aria-label="Select example"
                          id="ProductCategories" {...register("ProductCategories", { required: true })}
                        >
                          <option value=''>--Select--</option>

                        {productCategories?.map((item: any, index: any) => (
                          <option key={index} value={item.categoryId}>
                            {`${!stringIsNullOrWhiteSpace(item.parentCategoryName) ? (item.parentCategoryName + ' >>') : ''}${item.name}`}
                          </option>
                        ))}


                        </select> */}

                        <Controller
                          name="SelectedCategoryIds" // The name of your input field
                          control={control}

                          rules={{ required: 'Please select at least one category' }}
                          render={({ field }) => (
                            <ReactSelect
                              {...field}
                              isMulti

                              options={optionsCategoriesList}
                            />
                          )}
                        />




                        {errors.SelectedCategoryIds && <SiteErrorMessage errorMsg='Please select at least one category' />}
                      </div>
                    </div>


                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label">Tags </label>
                        {/* <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.SelectedTagIds ? 'is-invalid' : 'is-valid') : ''}`}

                          aria-label="Select example"
                          id="SelectedTagIds" {...register("SelectedTagIds", { required: false })}
                        >
                          <option value=''>--Select--</option>

                          {productTagsOptions?.map((item: any, index: any) => (
                                            <option key={index} value={item.categoryId}>
                                                {item.name}
                                            </option>
                                        ))}
                        </select> */}


                        <Controller
                          name="SelectedTagIds" // The name of your input field
                          control={control}
                          rules={{ required: 'Please select at least one tag' }}
                          render={({ field }) => (
                            <ReactSelect
                              {...field}
                              isMulti
                              options={productTagsOptions}
                            />
                          )}
                        />



                        {errors.SelectedTagIds && <SiteErrorMessage errorMsg='Please select at least one tag' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">SKU</label>
                        <input
                          type="text"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.Sku ? 'is-invalid' : 'is-valid') : ''}`}
                          id="Sku" {...register("Sku", { required: false })}

                          placeholder="Enter sku"
                        />
                        {errors.Sku && <SiteErrorMessage errorMsg='SKU is required' />}
                      </div>
                    </div>


                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-2 col-form-label fs-6 required'>Is Active</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.Sku ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="IsActive" {...register("IsActive", { required: false })}
                              defaultChecked={true}

                            />
                            <label className='form-check-label'></label>
                          </div>
                          {errors.IsActive && <SiteErrorMessage errorMsg='Status is required' />}
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-2 col-form-label fs-6'>Mark as new</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.MarkAsNew ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="MarkAsNew" {...register("MarkAsNew", { required: false })}
                              defaultChecked={true}

                            />
                            <label className='form-check-label'></label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-2 col-form-label fs-6'>Allow customer reviews</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.AllowCustomerReviews ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="AllowCustomerReviews" {...register("AllowCustomerReviews", { required: false })}
                              defaultChecked={false}

                            />
                            <label className='form-check-label'></label>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
                  <div className='row'>
                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required ">Selling Price</label>
                        <input
                          type="number"
                          min={0}
                          className={`form-control form-control-solid ${formSubmitted ? (errors.Price ? 'is-invalid' : 'is-valid') : ''}`}
                          id="Price" {...register("Price", { required: true })}

                          placeholder="Enter price"
                        />
                        {errors.Price && <SiteErrorMessage errorMsg='Price is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label ">Selling Old Price</label>
                        <input
                          type="number"
                          min={0}

                          className={`form-control form-control-solid ${formSubmitted ? (errors.OldPrice ? 'is-invalid' : 'is-valid') : ''}`}
                          id="OldPrice" {...register("OldPrice", { required: false })}

                          placeholder="Enter old price"
                        />
                        {errors.OldPrice && <SiteErrorMessage errorMsg='Old price is required' />}
                      </div>
                    </div>
                    <div className='col-lg-12'>
                      <div className="mb-10">
                        <label className="form-label ">Associated Tax</label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.TaxRuleId ? 'is-invalid' : 'is-valid') : ''}`}
                          aria-label="Select example"
                          id="TaxRuleId" {...register("TaxRuleId", { required: false })}
                          onChange={GetProductAttributeValuesByAttributeID}
                        >
                          <option value=''>--Select Tax--</option>

                          {allTaxRules?.filter((x: { taxRuleType: any }) => x.taxRuleType == taxRulesTypesConst.ForProduct)?.map((item: any, index: any) => (
                            <option key={index} value={item.taxRuleId}>
                              {`Category: ${item.categoryName}, Tax Rate: ${item.taxRate}`}
                            </option>
                          ))}
                        </select>


                        {errors.TaxRuleId && <SiteErrorMessage errorMsg='Tax is required' />}
                      </div>
                    </div>

                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-2 col-form-label fs-6 required'>Is Discount Allowed</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.IsDiscountAllowed ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="IsDiscountAllowed" {...register("IsDiscountAllowed", { required: false })}
                              defaultChecked={false}

                            />
                            <label className='form-check-label'></label>
                          </div>
                          {errors.IsDiscountAllowed && <SiteErrorMessage errorMsg='This field is required' />}
                        </div>
                      </div>
                    </div>


                  </div>
                </div>

                <div className="tab-pane fade" id="kt_tab_pane_3" role="tabpanel">
                  <div className="row mb-5" style={{ borderBottom: '2px solid #99A1B7' }}>

                    <div className="col-lg-3">
                      <div className="mb-10">
                        <label className="form-label  ">Product Image </label>
                        {/* below input field is without control register of useForm */}
                        <input className='form-control' type="file" multiple id="ProductImages" onChange={handleImageChange} />

                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div className="mb-10">
                        <div className="produc-images-area">
                          <div className="produc-images-inner">
                            <div className="row">
                              {productImages && productImages.length > 0
                                ? productImages.map((image: Blob | MediaSource, index: any) => (

                                  <div className="col-lg-3 mb-5">
                                    <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                                      <img src={URL.createObjectURL(image)} alt={`Product ${index}`} />
                                      <button className='img-button-remove' type="button" onClick={() => handleRemoveImage(index)} >X</button>

                                    </div>
                                  </div>
                                ))
                                :
                                <>
                                  <div className="fs-6 fw-bold text-gray-500">No image selected</div>
                                </>

                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>

                  <AdminProductsMappedImages
                    productId={productId}
                  />

                </div>

                <div className="tab-pane fade" id="kt_tab_pane_4" role="tabpanel">

                  <div className='row'>
                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Attribute Name</label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.productAttributeId ? 'is-invalid' : 'is-valid') : ''}`}
                          aria-label="Select example"
                          id="productAttributeId" {...register("productAttributeId", { required: false })}
                          onChange={GetProductAttributeValuesByAttributeID}
                        >
                          <option value=''>--Select--</option>

                          {attributesDropdown?.map((item: any, index: any) => (
                            <option key={index} value={item.productAttributeId}>
                              {item.displayName}

                            </option>
                          ))}
                        </select>
                        {errors.productAttributeId && <SiteErrorMessage errorMsg='Attribute Name is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Price Adjustment Type</label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.PriceAdjustmentType ? 'is-invalid' : 'is-valid') : ''}`}
                          aria-label="Select example"
                          id="PriceAdjustmentType" {...register("PriceAdjustmentType", { required: false })}
                        >
                          <option value="1" selected>Fixed Value</option>
                          <option value="2">Percentage</option>
                        </select>
                        {errors.PriceAdjustmentType && <SiteErrorMessage errorMsg='Price Adjustment Type is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label ">Price adjustment</label>
                        <input
                          type="number"
                          min={0}
                          className={`form-control form-control-solid ${formSubmitted ? (errors.PriceAdjustment ? 'is-invalid' : 'is-valid') : ''}`}
                          id="PriceAdjustment" {...register("PriceAdjustment", { required: false })}

                          placeholder="Enter price adjustment"
                        />
                        {errors.PriceAdjustment && <SiteErrorMessage errorMsg='This field is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Attribute Value</label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.AttributeValue ? 'is-invalid' : 'is-valid') : ''}`}
                          aria-label="Select example"
                          id="AttributeValue" {...register("AttributeValue", { required: false })}
                        >
                          <option value=''>--Select--</option>

                          {selectedProductAttributeValues?.map((item: any, index: any) => (
                            <option key={index} value={item.displayValue}>
                              {item.displayText}
                            </option>
                          ))}


                        </select>
                        {errors.AttributeValue && <SiteErrorMessage errorMsg='Attribute value is required' />}
                      </div>
                    </div>


                  </div>

                  <div className='d-flex justify-content-end mb-6'>

                    <a href="#" className="btn btn-info btn-sm"
                      onClick={AddProductAttributeRow}
                    ><i className="bi bi-chat-square-text-fill fs-4 me-2"></i> Add Attribute</a>
                  </div>

                  <AdminProductAttributesList
                    productMappedAttributes={productMappedAttributes}
                    onDeleteClick={handleOnDeleteAttributeClick}
                    handleGoToPageAttribute={handleGoToPageAttribute}
                    pageBasicInfoAttribute={pageBasicInfoAttribute}
                  />

                </div>

                <div className="tab-pane fade" id="kt_tab_pane_5" role="tabpanel">

                  <div className="row">
                    <div className='col-lg-12'>
                      <div className='row mb-8'>
                        <label className='col-lg-2 col-form-label fs-6 '>Free Shipping</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.IsShippingFree ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="IsShippingFree" {...register("IsShippingFree", { required: false })}
                              defaultChecked={false}
                              onChange={handleIsFreeShippingCheckboxChange}

                            />
                            <label className='form-check-label'></label>
                          </div>
                          {errors.IsShippingFree && <SiteErrorMessage errorMsg='This is required' />}
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-6' style={{ display: isFreeShippingChecked == true ? 'none' : 'block' }}>
                      <div className="mb-10">
                        <label className="form-label ">Shipping Charges</label>
                        <input
                          type="number"
                          min={0}
                          className={`form-control form-control-solid ${formSubmitted ? (errors.ShippingCharges ? 'is-invalid' : 'is-valid') : ''}`}
                          id="ShippingCharges" {...register("ShippingCharges", { required: false })}

                          placeholder="Enter price adjustment"
                        />
                        {errors.ShippingCharges && <SiteErrorMessage errorMsg='This field is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Shipping Methods</label>
                        {/* <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.SelectedShippingMethodIds ? 'is-invalid' : 'is-valid') : ''}`}
                          aria-label="Select example"
                          id="SelectedShippingMethodIds" {...register("SelectedShippingMethodIds", { required: false })}
                          onChange={GetProductAttributeValuesByAttributeID}
                        >
                          <option value=''>--Select--</option>

                          {shippingMethodsList?.map((item: any, index: any) => (
                            <option key={index} value={item.shippingMethodId}>
                              {item.methodName}

                            </option>
                          ))}
                        </select> */}

                        <Controller
                          name="SelectedShippingMethodIds" // The name of your input field
                          control={control}
                          rules={{ required: false }}
                          render={({ field }) => (
                            <ReactSelect
                              {...field}
                              isMulti
                              options={shippingMethodsOptions}
                            />
                          )}
                        />




                        {errors.SelectedShippingMethodIds && <SiteErrorMessage errorMsg='Please add atleast one shipping method' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Estimated Shipping Days</label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.EstimatedShippingDays ? 'is-invalid' : 'is-valid') : ''}`}
                          aria-label="Select example"
                          id="EstimatedShippingDays" {...register("EstimatedShippingDays", { required: false })}
                          onChange={GetProductAttributeValuesByAttributeID}
                        >
                          <option value=''>--Select--</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='4'>4</option>


                        </select>
                        {errors.EstimatedShippingDays && <SiteErrorMessage errorMsg='Attribute Name is required' />}
                      </div>
                    </div>
                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-2 col-form-label fs-6 '>Is ReturnAble?</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.IsReturnAble ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="IsReturnAble" {...register("IsReturnAble", { required: false })}
                              defaultChecked={false}

                            />
                            <label className='form-check-label'></label>
                          </div>
                          {errors.IsReturnAble && <SiteErrorMessage errorMsg='This is required' />}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" type='submit'><i className="fas fa-save fs-4 me-2"></i> Submit</button>

              </div>

            </form>

          </KTCardBody>
        </KTCard>
      </Content>
    </AdminLayout>
  )
}
