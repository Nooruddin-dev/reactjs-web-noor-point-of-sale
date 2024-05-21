/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { KTCardBody, KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';
import { GetProductInventoryItemsByIdApi, getInvnetoryMethodsListApi, getWarehousesListApi, insertUpdateInventoryMainApi, insertUpdateProductAttributesInventoryItemsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';

interface StockConfigurationModalInterface {
    isOpen: boolean,
    closeModal: any,
    selectedInventoryId: any,
    selectedProductId: any
}


const StockConfigurationModal: React.FC<StockConfigurationModalInterface> = ({
    isOpen,
    closeModal,
    selectedInventoryId,
    selectedProductId
}) => {

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [inventoryItemsDetail, setInventoryItemsDetail] = useState<any>(null);
    const [attributeBasedInventoryData, setAttributeBasedInventoryData] = useState<any>();
    const [warehousesList, setWarehousesList] = useState<any>([]);
    const [inventoryMethodsList, setInventoryMethodsList] = useState<any>();
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);

    const onSubmitProductBasedForm = (data: any) => {
        const { inventoryMethodId, warehouseId, stockQuantity, orderMinimumQuantity, orderMaximumQuantity, sellStartDatetimeUTC,
            sellEndDatetimeUTC, isBoundToStockQuantity, displayStockQuantity } = data;

        if (selectedInventoryId == null || selectedInventoryId == undefined) {
            showErrorMsg('Invalid inventory id. Please try again!');
            return;
        }

        let formData = {
            inventoryId: selectedInventoryId,
            inventoryMethodId: inventoryMethodId,
            warehouseId: warehouseId,
            stockQuantity: stockQuantity,
            orderMinimumQuantity: orderMinimumQuantity,
            orderMaximumQuantity: orderMaximumQuantity,
            sellStartDatetimeUTC: sellStartDatetimeUTC,
            sellEndDatetimeUTC: sellEndDatetimeUTC,
            isBoundToStockQuantity: isBoundToStockQuantity,
            displayStockQuantity: displayStockQuantity
        };


        insertUpdateInventoryMainApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");


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


    const handleInputChange = (index: number, fieldName: string, value: any) => {

        const newData = [...attributeBasedInventoryData];
        newData[index][fieldName] = value;
        setAttributeBasedInventoryData(newData);
    };

    const setStartAndEndDateOfAttribute = (inputDate: any)=>{
        if(!stringIsNullOrWhiteSpace(inputDate)){
          return  inputDate.split('T')[0];
        }else{
            return inputDate;
        }
    }


    const handleSaveAttributeBasedData = () => {
        // Send attributeBasedInventoryData to API for saving
        console.log(attributeBasedInventoryData); // Replace this with your API call

        
        if (attributeBasedInventoryData == null || attributeBasedInventoryData == undefined) {
            showErrorMsg('There is no attribute for this product!');
            return;
        }

        let formData = {
            inventoryId : selectedInventoryId,
            productId : selectedProductId,
            attributeBasedInventoryDataJson: JSON.stringify(attributeBasedInventoryData),
          
        };


        insertUpdateProductAttributesInventoryItemsApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    setListRefreshCounter(prevCounter => prevCounter + 1);

                } else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });
    };


    //--update form fields in below useEffect
    useEffect(() => {
        if (inventoryItemsDetail?.inventoryMain != undefined && inventoryItemsDetail?.inventoryMain != null) {
            setValue('inventoryMethodId', inventoryItemsDetail?.inventoryMain?.inventoryMethodId);
            setValue('warehouseId', inventoryItemsDetail?.inventoryMain?.warehouseId);
            setValue('stockQuantity', inventoryItemsDetail?.inventoryMain?.stockQuantity);
            setValue('orderMinimumQuantity', inventoryItemsDetail?.inventoryMain?.orderMinimumQuantity);
            setValue('orderMaximumQuantity', inventoryItemsDetail?.inventoryMain?.orderMaximumQuantity);

            if (inventoryItemsDetail?.inventoryMain?.sellStartDatetimeUTC) {
                setValue('sellStartDatetimeUTC', inventoryItemsDetail.inventoryMain.sellStartDatetimeUTC.split('T')[0]);
            }

            if (inventoryItemsDetail?.inventoryMain?.sellEndDatetimeUTC) {
                setValue('sellEndDatetimeUTC', inventoryItemsDetail.inventoryMain.sellEndDatetimeUTC.split('T')[0]);
            }

            setValue('isBoundToStockQuantity', inventoryItemsDetail?.inventoryMain?.isBoundToStockQuantity);
            setValue('displayStockQuantity', inventoryItemsDetail?.inventoryMain?.displayStockQuantity);
        }

    }, [inventoryItemsDetail, warehousesList, inventoryMethodsList]);

    useEffect(() => {
        getWarehousesListService();
        GetProductInventoryItemsByIdService();
        getInvnetoryMethodsListService();
    }, [listRefreshCounter]);

    const getWarehousesListService = () => {

        const pageInfoWarehouseRequest: any = {
            PageNo: 1,
            PageSize: 200
        }
        const pageInfoWarehouseParam = new URLSearchParams(pageInfoWarehouseRequest).toString();

        getWarehousesListApi(pageInfoWarehouseParam)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setWarehousesList(res?.data);
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };


    const getInvnetoryMethodsListService = () => {

        const pageInfoInventoryMethodsRequest: any = {
            PageNo: 1,
            PageSize: 30
        }
        const pageInfoInventoryParam = new URLSearchParams(pageInfoInventoryMethodsRequest).toString();

        getInvnetoryMethodsListApi(pageInfoInventoryParam)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setInventoryMethodsList(res?.data);
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };


    const GetProductInventoryItemsByIdService = () => {


        GetProductInventoryItemsByIdApi(selectedInventoryId, selectedProductId)
            .then((res: any) => {
                const { data } = res;

                if (data) {
                    setInventoryItemsDetail(data);
                    setAttributeBasedInventoryData(data?.productMappedAttributes)
                    console.log('inventory items detail: ', inventoryItemsDetail);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-large-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Update Stock Configuration</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>

                <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                    <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-6 fs-6 pb-4" style={{ borderBottom: '0px' }}>
                        <li className="nav-item">
                            <a
                                className="nav-link active text-active-primary fw-bolder"
                                data-bs-toggle="tab"
                                href="#kt_tab_pane_1"
                            >
                                Product Based Configuration
                            </a>

                        </li>
                        <li className="nav-item ">
                            <a
                                className="nav-link text-active-primary fw-bolder"
                                data-bs-toggle="tab"
                                href="#kt_tab_pane_2"
                            >
                                Attributed Based Configuration
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content" id="myTabContent">
                        <div
                            className="tab-pane fade show active"
                            id="kt_tab_pane_1"
                            role="tabpanel"
                        >
                            <form
                                onSubmit={(e) => {
                                    handleSubmit(onSubmitProductBasedForm)(e);
                                    setFormSubmitted(true);
                                }}
                            >

                                <div className='row'>

                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label">Inventory Method </label>
                                            <select
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.inventoryMethodId ? 'is-invalid' : 'is-valid') : ''}`}

                                                aria-label="Select example"
                                                id="inventoryMethodId" {...register("inventoryMethodId", { required: false })}
                                            >
                                                <option value=''>--Select--</option>
                                                {inventoryMethodsList?.map((item: any, index: any) => (
                                                    <option key={index} value={item.inventoryMethodId}>
                                                        {item.inventoryMethodName}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>
                                    </div>

                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label">Warehouse </label>
                                            <select
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.warehouseId ? 'is-invalid' : 'is-valid') : ''}`}

                                                aria-label="Select example"
                                                id="warehouseId" {...register("warehouseId", { required: false })}
                                            >
                                                <option value=''>--Select--</option>
                                                {warehousesList?.map((item: any, index: any) => (
                                                    <option key={index} value={item.warehouseId}>
                                                        {item.warehouseName}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>
                                    </div>

                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Stock Quantity</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.stockQuantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="stockQuantity" {...register("stockQuantity", { required: true })}

                                                placeholder="Enter stock quantity"
                                            />
                                            {errors.stockQuantity && <SiteErrorMessage errorMsg='Stock quantity is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Order Min Cart Quantity</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.orderMinimumQuantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="orderMinimumQuantity" {...register("orderMinimumQuantity", { required: true })}

                                                placeholder="Enter order min cart quantity"
                                            />
                                            {errors.orderMinimumQuantity && <SiteErrorMessage errorMsg='Order min cart quantity is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Order Max Cart Quantity</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.orderMaximumQuantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="orderMaximumQuantity" {...register("orderMaximumQuantity", { required: true })}

                                                placeholder="Enter order max cart quantity"
                                            />
                                            {errors.orderMaximumQuantity && <SiteErrorMessage errorMsg='Order max cart quantity is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Available Start Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.sellStartDatetimeUTC ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="sellStartDatetimeUTC" {...register("sellStartDatetimeUTC", { required: true })}

                                                placeholder="Enter order max cart quantity"
                                            />
                                            {errors.sellStartDatetimeUTC && <SiteErrorMessage errorMsg='Start is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Available End Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.sellEndDatetimeUTC ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="sellEndDatetimeUTC" {...register("sellEndDatetimeUTC", { required: true })}

                                                placeholder="Enter order max cart quantity"
                                            />
                                            {errors.sellEndDatetimeUTC && <SiteErrorMessage errorMsg='End date is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-12'>
                                        <div className='row mb-0'>
                                            <label className='col-lg-2 col-form-label fs-6 required'>Bound to Stock Quantity</label>

                                            <div className='col-lg-3 d-flex align-items-center'>
                                                <div className='form-check form-check-solid form-switch fv-row'>
                                                    <input
                                                        className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.isBoundToStockQuantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                        type='checkbox'
                                                        id="isBoundToStockQuantity" {...register("isBoundToStockQuantity", { required: false })}
                                                        defaultChecked={true}

                                                    />
                                                    <label className='form-check-label'></label>
                                                </div>
                                                {errors.isBoundToStockQuantity && <SiteErrorMessage errorMsg='Bount to stock quantity is required' />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-lg-12'>
                                        <div className='row mb-0'>
                                            <label className='col-lg-2 col-form-label fs-6 required'>Display Stock Quantity</label>

                                            <div className='col-lg-3 d-flex align-items-center'>
                                                <div className='form-check form-check-solid form-switch fv-row'>
                                                    <input
                                                        className={`form-check-input w-45px h-30px ${formSubmitted ? (errors.displayStockQuantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                        type='checkbox'
                                                        id="displayStockQuantity" {...register("displayStockQuantity", { required: false })}
                                                        defaultChecked={true}

                                                    />
                                                    <label className='form-check-label'></label>
                                                </div>
                                                {errors.displayStockQuantity && <SiteErrorMessage errorMsg='Display stock quantity required' />}
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-danger" type='submit'>Save Product Based Config</button>
                                </div>
                            </form>
                        </div>

                        <div
                            className="tab-pane fade"
                            id="kt_tab_pane_2"
                            role="tabpanel"
                        >

                            <div className='row'>
                                <div className="col-lg-12">
                                    <KTCardBody className='py-4'>
                                        <div className='table-responsive'>
                                            <table
                                                id='kt_table_users'
                                                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                            >
                                                <thead>
                                                    <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Attribute Name</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Attribute Value</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Inventory Method</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Warehouse</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Stock Quantity</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Min Cart Quantity</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Max Cart Quantity</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Start Date</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>End Date</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Bound to Stock Quantity</th>
                                                        <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Display Stock Quantity</th>

                                                    </tr>
                                                </thead>
                                                <tbody className='text-gray-600 fw-bold'>


                                                    {
                                                        inventoryItemsDetail?.productMappedAttributes != undefined && inventoryItemsDetail?.productMappedAttributes.length > 0
                                                            ?
                                                            inventoryItemsDetail?.productMappedAttributes?.map((record: any, index: number) => (
                                                                <tr role='row'>
                                                                    <td role="cell" className="ps-3">{record.attributeDisplayName}</td>
                                                                    <td role="cell" className="">{record.attributeValueDisplayText}</td>
                                                                    <td role="cell" className="">
                                                                        <select
                                                                            className='form-select form-select-solid'
                                                                            value={record.inventoryMethodId || ''}
                                                                            onChange={(e) => handleInputChange(index, 'inventoryMethodId', e.target.value)}
                                                                        >
                                                                            <option value=''>--Select--</option>
                                                                            {inventoryMethodsList?.map((item: any, index: any) => (
                                                                                <option key={index} value={item.inventoryMethodId}>
                                                                                    {item.inventoryMethodName}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td role="cell" className="">
                                                                        <select
                                                                            className='form-select form-select-solid'
                                                                            value={record.warehouseId || ''}
                                                                            onChange={(e) => handleInputChange(index, 'warehouseId', e.target.value)}
                                                                        >
                                                                            <option value=''>--Select--</option>
                                                                            {warehousesList?.map((item: any, index: any) => (
                                                                                <option key={index} value={item.warehouseId}>
                                                                                    {item.warehouseName}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </td>

                                                                    <td role="cell" className="">
                                                                        <input
                                                                            className='form-select form-select-solid'
                                                                            type="number"
                                                                            min={0}
                                                                            value={record.stockQuantity || ''}
                                                                            onChange={(e) => handleInputChange(index, 'stockQuantity', e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td role="cell" className="">
                                                                        <input
                                                                            className='form-select form-select-solid'
                                                                            type="number"
                                                                            min={0}
                                                                            value={record.orderMinimumQuantity || ''}
                                                                            onChange={(e) => handleInputChange(index, 'orderMinimumQuantity', e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td role="cell" className="">
                                                                        <input
                                                                            className='form-select form-select-solid'
                                                                            type="number"
                                                                            min={0}
                                                                            value={record.orderMaximumQuantity || ''}
                                                                            onChange={(e) => handleInputChange(index, 'orderMaximumQuantity', e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td role="cell" className="">
                                                                        <input
                                                                            className='form-select form-select-solid'
                                                                            type="date"
                                                                            value={setStartAndEndDateOfAttribute(record.sellStartDatetimeUTC)  || ''}
                                                                            onChange={(e) => handleInputChange(index, 'sellStartDatetimeUTC', e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td role="cell" className="">
                                                                        <input
                                                                            className='form-select form-select-solid'
                                                                            type="date"
                                                                            value={setStartAndEndDateOfAttribute(record.sellEndDatetimeUTC)  || ''}
                                                                            onChange={(e) => handleInputChange(index, 'sellEndDatetimeUTC', e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td role="cell" className="">

                                                                        <div className='d-flex align-items-center'>
                                                                            <div className='form-check form-check-solid form-switch fv-row'>
                                                                                <input
                                                                                    className={`form-check-input w-45px h-30px `}
                                                                                    type='checkbox'
                                                                                    onChange={(e) => handleInputChange(index, 'isBoundToStockQuantity', e.target.checked)}
                                                                                    checked={record.isBoundToStockQuantity || false}

                                                                                />
                                                                                <label className='form-check-label'></label>
                                                                            </div>

                                                                        </div>
                                                                    </td>

                                                                    <td role="cell" className="ps-3">
                                                                        <div className='d-flex align-items-center'>
                                                                            <div className='form-check form-check-solid form-switch fv-row'>
                                                                                <input
                                                                                    className={`form-check-input w-45px h-30px `}
                                                                                    type='checkbox'
                                                                                    onChange={(e) => handleInputChange(index, 'displayStockQuantity', e.target.checked)}
                                                                                    checked={record.displayStockQuantity || false}

                                                                                />
                                                                                <label className='form-check-label'></label>
                                                                            </div>

                                                                        </div>

                                                                    </td>








                                                                </tr>

                                                            ))
                                                            :
                                                            <tr>
                                                                <td colSpan={20}>
                                                                    <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                                                        No matching records found
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                    }






                                                </tbody>
                                            </table>
                                        </div>




                                    </KTCardBody>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-danger" type='button' onClick={handleSaveAttributeBasedData}>Save Attribute Based Config</button>
                            </div>

                        </div>
                    </div>


                </div>

                <div className='admin-modal-footer'>
                    <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>


                </div>

            </div>


        </ReactModal >
    )
}

export default StockConfigurationModal;