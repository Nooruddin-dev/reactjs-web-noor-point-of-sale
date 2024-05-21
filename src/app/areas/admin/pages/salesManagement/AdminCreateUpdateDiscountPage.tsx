/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import AdminPageHeader from '../../components/layout/AdminPageHeader'
import { Content } from '../../../../../_poscommon/admin/layout/components/content'
import { KTCard, KTCardBody } from '../../../../../_poscommon/admin/helpers'
import SiteErrorMessage from '../../../common/components/SiteErrorMessage'
import { Controller, useForm } from 'react-hook-form';

import { getDiscountDetailByIdApi, getDiscountsTypesListApi, getProductsMappedAttributesListApi, insertUpdateDiscountApi, insertUpdateProductApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'

import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper'
import { useNavigate, useParams } from 'react-router'

import { faCircleInfo, faImage, faTags, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DiscountTypesEnum } from '../../../../../_poscommon/common/enums/GlobalEnums'
import DiscountProductsPartial from '../../components/salesManagement/DiscountProductsPartial'
import DiscountCategoriesPartial from '../../components/salesManagement/DiscountCategoriesPartial'




type FormInputs = {
  title: string,
  discountTypeId: number,
  discountValueType: number,
  discountValue: number
  startDate: any,
  endDate: any,
  isCouponCodeRequired: boolean,
  couponCode: string,
  isActive: boolean

}




export default function AdminCreateUpdateDiscountPage() {
  const navigate = useNavigate();
  const [defaultValuesEdit, setDefaultValuesEdit] = useState<any>({}); // Data of the category being edited
  const { control, register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<FormInputs>();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [currentSelectedDiscountTypeId, setCurrentSelectedDiscountTypeId] = useState<any>(0);
  const [discountTypesList, setDiscountTypesList] = useState<any>([]);
  const [discountValueTypesList, setDiscountValueTypesList] = useState<any>([
    { value: "1", text: "Fixed Value" },
    { value: "2", text: "Percentage" }
  ]);
  const [discountDetailById, setDiscountDetailById] = useState<any>({});
  const [selectedProductsForDiscountToAdd, setSelectedProductsForDiscountToAdd] = useState<any>([]);
  const [selectedCategoriesForDiscountToAdd, setSelectedCategoriesForDiscountToAdd] = useState<any>([]);

  const params = useParams();
  const discountId = params?.discountId ?? '0';


  const GetSelectedDiscountTypeData = (event: any, value: any) => {
    event.preventDefault();
    setCurrentSelectedDiscountTypeId(value);


  }

  const onSubmitDiscountForm = (data: any) => {

    const {
      title,
      discountTypeId,
      discountValueType,
      discountValue,
      startDate,
      endDate,
      isCouponCodeRequired,
      couponCode,
      isActive } = data;

    if (!data) {
      showErrorMsg('No valid data. Please try again');
      return false;
    }




    //--coupon code validation
    if (isCouponCodeRequired == true) {
      if (stringIsNullOrWhiteSpace(couponCode)) {
        showErrorMsg("Coupon code required!");
        return false;
      }
    }

    let discountAssociatedProductsTableRows: any = [];
    let discountAssociatedCategoriesTableRows: any = [];
    if (discountTypeId == DiscountTypesEnum.PRODUCTS) {
      selectedProductsForDiscountToAdd.forEach((record: any) => {
        discountAssociatedProductsTableRows.push({
          productId: record.productId,
        });
      });

    } else if (discountTypeId == DiscountTypesEnum.CATEGORIES) {
     
      selectedCategoriesForDiscountToAdd.forEach((record: any) => {
        discountAssociatedCategoriesTableRows.push({
          categoryId: record.categoryId,
        });
      });
      
    }



    var discountFormData = {
      discountId: discountId,
      title: title,
      discountTypeId: discountTypeId,
      discountValueType: discountValueType,
      discountValue: discountValue,
      startDate: startDate,
      endDate: endDate,
      isCouponCodeRequired: isCouponCodeRequired,
      couponCode: couponCode,
      isActive: isActive,

      discountAssociatedProducts: discountAssociatedProductsTableRows,
      discountAssociatedCategories: discountAssociatedCategoriesTableRows
    }


    insertUpdateDiscountApi(discountFormData)
      .then((res: any) => {

        if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
          showSuccessMsg("Saved Successfully!");
          //--clear form
          setTimeout(() => {

            navigate('/admin/discounts');

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

    if (discountDetailById != null && discountDetailById != undefined) {
      //--set other fields
      setValue('discountTypeId', discountDetailById.discountTypeId);
      setValue('discountValueType', discountDetailById.discountValueType);
    }

  }, [discountDetailById]);

  // ✅ --One time API calss. Do not add any variable in dependency array of below useEffect()
  useEffect(() => {

    getDiscountsTypesListService();
    getDiscountDetailByIdService();

  }, []);

  const getDiscountsTypesListService = () => {

    const discountTypesPageInfoRequest: any = {
      PageNo: 1,
      PageSize: 100
    }
    const discountTypesPageInfoParam = new URLSearchParams(discountTypesPageInfoRequest).toString();

    getDiscountsTypesListApi(discountTypesPageInfoParam)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          const finalData = data?.filter((x: { isActive: boolean }) => x.isActive == true);
          setDiscountTypesList(finalData);
        } else {
          setDiscountTypesList([]);
        }

      })
      .catch((err: any) => console.log(err, "err"));
  };

  const getDiscountDetailByIdService = () => {

    getDiscountDetailByIdApi(discountId)
      .then((res: any) => {
        const { data } = res;
        console.log('discount detail: ', data);
        if (data) {
          setValue('title', data.title);
          setValue('discountTypeId', data.discountTypeId);

          setValue('discountValueType', data.discountValueType);

          setValue('discountValue', data.discountValue);
          if (!stringIsNullOrWhiteSpace(data.startDate)) {
            setValue('startDate', data.startDate?.split('T')[0]);
          }

          if (!stringIsNullOrWhiteSpace(data.endDate)) {
            setValue('endDate', data.endDate?.split('T')[0]);
          }

          setValue('isCouponCodeRequired', data.isCouponCodeRequired);
          setValue('couponCode', data.couponCode);
          setValue('isActive', data.isActive);

          setCurrentSelectedDiscountTypeId(data.discountTypeId);

          //--Set whole object
          setDiscountDetailById(data);


        }


      })
      .catch((err: any) => console.log(err, "err"));
  };





  return (
    <AdminLayout>
      <AdminPageHeader
        title='Create Discount'
        pageDescription='Create Discount'
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
                handleSubmit(onSubmitDiscountForm)(e);
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
                    Discounts Info
                  </a>

                </li>
                <li className="nav-item "
                  style={{ display: currentSelectedDiscountTypeId == DiscountTypesEnum.PRODUCTS ? 'list-item' : 'none' }}
                >
                  <a
                    className="nav-link text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_2"
                  >
                    <FontAwesomeIcon icon={faTags} className='me-2' />
                    Link Products
                  </a>
                </li>


                <li className="nav-item"
                  style={{ display: currentSelectedDiscountTypeId == DiscountTypesEnum.CATEGORIES ? 'list-item' : 'none' }}
                >
                  <a
                    className="nav-link text-active-primary fw-bolder"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_3"
                  >
                    <FontAwesomeIcon icon={faImage} className='me-2' />
                    Link Categories
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
                        <label className="form-label required ">Title</label>
                        <input
                          type="text"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.title ? 'is-invalid' : 'is-valid') : ''}`}
                          id="title" {...register("title", { required: true })}

                          placeholder="Enter discount title"
                        />
                        {errors.title && <SiteErrorMessage errorMsg='Title is required' />}
                      </div>
                    </div>




                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required">Discount Type </label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.discountTypeId ? 'is-invalid' : 'is-valid') : ''}`}

                          aria-label="Select example"
                          id="discountTypeId" {...register("discountTypeId", { required: true })}
                          onChange={(e) => GetSelectedDiscountTypeData(e, e.target.value)}
                        >

                          <option value=''>--Select--</option>

                          {discountTypesList?.map((item: any, index: any) => (
                            <option key={index} value={item.discountTypeId}>
                              {item.discountTypeName}
                            </option>
                          ))}

                        </select>
                        {errors.discountTypeId && <SiteErrorMessage errorMsg='Discount type is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required">Discount Value Type </label>
                        <select
                          className={`form-select form-select-solid ${formSubmitted ? (errors.discountValueType ? 'is-invalid' : 'is-valid') : ''}`}

                          aria-label="Select discount value type"
                          id="discountValueType" {...register("discountValueType", { required: true })}
                        >

                          <option value=''>--Select--</option>

                          {discountValueTypesList?.map((item: any, index: any) => (
                            <option key={index} value={item.value}>
                              {item.text}
                            </option>
                          ))}

                        </select>
                        {errors.discountValueType && <SiteErrorMessage errorMsg='Discount value type is required' />}
                      </div>
                    </div>


                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required ">Discount Value</label>
                        <input
                          type="number"
                          min={0}
                          className={`form-control form-control-solid ${formSubmitted ? (errors.discountValue ? 'is-invalid' : 'is-valid') : ''}`}
                          id="discountValue" {...register("discountValue", { required: true })}

                          placeholder="Enter discount value"
                        />
                        {errors.discountValue && <SiteErrorMessage errorMsg='Discount value is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required "> Start Date</label>
                        <input
                          type="date"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.startDate ? 'is-invalid' : 'is-valid') : ''}`}
                          id="startDate" {...register("startDate", { required: true })}

                          placeholder="Enter start date"
                        />
                        {errors.startDate && <SiteErrorMessage errorMsg='Start date is required' />}
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label required "> End Date</label>
                        <input
                          type="date"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.endDate ? 'is-invalid' : 'is-valid') : ''}`}
                          id="endDate" {...register("endDate", { required: true })}

                          placeholder="Enter end date"
                        />
                        {errors.endDate && <SiteErrorMessage errorMsg='End date is required' />}
                      </div>
                    </div>







                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-3 col-form-label fs-6'>Is Coupon Code Required?</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.isCouponCodeRequired ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="isCouponCodeRequired" {...register("isCouponCodeRequired", { required: false })}
                              defaultChecked={true}

                            />
                            <label className='form-check-label'></label>
                          </div>
                          {errors.isCouponCodeRequired && <SiteErrorMessage errorMsg='Is coupon code is required' />}
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className="mb-10">
                        <label className="form-label  ">Coupon Code</label>
                        <input
                          type="text"

                          className={`form-control form-control-solid ${formSubmitted ? (errors.couponCode ? 'is-invalid' : 'is-valid') : ''}`}
                          id="couponCode" {...register("couponCode", { required: false })}

                          placeholder="Enter coupon code"
                        />
                        {errors.couponCode && <SiteErrorMessage errorMsg='Coupon code is required' />}
                      </div>
                    </div>

                    <div className='col-lg-12'>
                      <div className='row mb-0'>
                        <label className='col-lg-3 col-form-label fs-6'>Is Active</label>

                        <div className='col-lg-3 d-flex align-items-center'>
                          <div className='form-check form-check-solid form-switch fv-row'>
                            <input
                              className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.isActive ? 'is-invalid' : 'is-valid') : ''}`}
                              type='checkbox'
                              id="isActive" {...register("isActive", { required: false })}
                              defaultChecked={true}

                            />
                            <label className='form-check-label'></label>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>

                </div>

                {
                  currentSelectedDiscountTypeId == DiscountTypesEnum.PRODUCTS
                    ?
                    <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel" >
                      <div className="row">
                        <div className="col-lg-12">
                          <DiscountProductsPartial
                            discountId={discountId}
                            currentSelectedDiscountTypeId={currentSelectedDiscountTypeId}
                            selectedProductsForDiscountToAdd={selectedProductsForDiscountToAdd}
                            setSelectedProductsForDiscountToAdd={setSelectedProductsForDiscountToAdd}
                          />
                        </div>
                      </div>
                    </div>
                    :
                    <>
                    </>
                }

                {
                  currentSelectedDiscountTypeId == DiscountTypesEnum.CATEGORIES
                    ?
                    <div className="tab-pane fade" id="kt_tab_pane_3" role="tabpanel">
                      <div className="row">
                        <div className="col-lg-12">
                          <DiscountCategoriesPartial
                            discountId={discountId}
                            currentSelectedDiscountTypeId={currentSelectedDiscountTypeId}
                            selectedCategoriesForDiscountToAdd={selectedCategoriesForDiscountToAdd}
                            setSelectedCategoriesForDiscountToAdd={setSelectedCategoriesForDiscountToAdd}
                          />
                        </div>
                      </div>
                    </div>
                    :
                    <>
                    </>
                }





              </div>

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary" type='submit'><i className="fas fa-save fs-4 me-2"></i>
                  {
                    parseInt(discountId) > 0 ? 'Update' : 'Save'
                  }

                </button>

              </div>

            </form>

          </KTCardBody>
        </KTCard>
      </Content>
    </AdminLayout>
  )
}
