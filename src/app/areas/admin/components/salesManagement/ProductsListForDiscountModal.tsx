
/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { KTCard, KTCardBody, KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';
import CommonListPagination from '../../../common/components/CommonListPagination';
import CommonListSearchHeader from '../../../common/components/CommonListSearchHeader';
import { getProductsListForDiscountApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { APP_BASIC_CONSTANTS } from '../../../../../_poscommon/common/constants/Config';
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig';
import { buildUrlParamsForSearch } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { getDateCommonFormatFromJsonDate } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';

interface ProductsListForDiscountModalProps {
    isOpen: boolean,
    closeModal: any,
    onAddSelectedItems: any
}



const ProductsListForDiscountModal: React.FC<ProductsListForDiscountModalProps> = ({
    isOpen,
    closeModal,
    onAddSelectedItems
}) => {

    const [allProductsListForDiscount, setAllProductsListForDiscount] = useState<any>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<any>([]);

    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {

            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );
    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'ProductIdSearch', inputName: 'ProductIdSearch', labelName: 'Product ID', placeHolder: 'Product ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'ProductNameSearch', inputName: 'ProductNameSearch', labelName: 'Product Name', placeHolder: 'Product Name', type: 'search', defaultValue: '', iconClass: 'fa fa-search' },

    ];

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter((prevCounter: number) => prevCounter + 1);
    };

    const handleSearchForm = (updatedSearchFields: HtmlSearchFieldConfig) => {
        const queryUrl = buildUrlParamsForSearch(updatedSearchFields);
        setSearchFormQueryParams(queryUrl);

        //--reset pageNo to 1
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: 1 // Update only the pageNo property
        }));

        setTimeout(() => {
            setListRefreshCounter((prevCounter: number) => prevCounter + 1);
        }, 300);

    }

    const handleSearchFormReset = (e: Event) => {
        if (e) {
            e.preventDefault();
        }
        //--reset pageNo to 1
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: 1 // Update only the pageNo property
        }));

        setSearchFormQueryParams('');
        setListRefreshCounter((prevCounter: number) => prevCounter + 1);
    }

    // Toggle the selected state for a product ID
    const handleCheckboxChange = (productId: number) => {
        setSelectedProductIds((prevIds: any) => {
            if (prevIds.includes(productId)) {
                // If the ID is already in the array, remove it
                return prevIds.filter((id: number) => id !== productId);
            } else {
                // If the ID is not in the array, add it
                return [...prevIds, productId];
            }
        });
    };

    // Handle 'Add selected items to discount' button click
    const handleAddSelected = () => {
        
        // Filter the original list to get only the selected products
        const selectedProducts = allProductsListForDiscount.filter((product: any) =>
            selectedProductIds.includes(product.productId)
        );


        //--make api call for saving

        // Call the passed-in function with the selected products
         onAddSelectedItems(selectedProducts);
    };


    useEffect(() => {

        const getProductsListForDiscountService = () => {

            let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
            if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
                pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
            }


            getProductsListForDiscountApi(pageBasicInfoParams)
                .then((res: any) => {
                    const { data } = res;
                    if (data && data.length > 0) {
                        const totalRecords = data[0]?.totalRecords;
                        setPageBasicInfo((prevPageBasicInfo: any) => ({
                            ...prevPageBasicInfo,
                            totalRecords: totalRecords
                        }));

                        setAllProductsListForDiscount(res?.data);
                    }


                })
                .catch((err: any) => console.log(err, "err"));
        };

        getProductsListForDiscountService();


    }, [listRefreshCounter]);


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
                    <h2>Products List</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>

                <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                    <div className='row'>

                        <div className="col-lg-12">
                            <KTCard>




                                <CommonListSearchHeader
                                    searchFields={HtmlSearchFields}
                                    onSearch={handleSearchForm}
                                    onSearchReset={handleSearchFormReset}
                                />

                                {/* <UsersTable /> */}
                                <KTCardBody className='py-4'>

                                    <div className='table-responsive'>
                                        <table
                                            id='kt_table_users'
                                            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                        >
                                            <thead>
                                                <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light'>
                                                    <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Select</th>
                                                    <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Product Id</th>
                                                    <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}> Product Name</th>
                                                    <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}> Price</th>
                                                    <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}> Created On</th>


                                                </tr>
                                            </thead>
                                            <tbody className='text-gray-600 fw-bold'>

                                                {
                                                    allProductsListForDiscount != undefined && allProductsListForDiscount.length > 0
                                                        ?
                                                        allProductsListForDiscount?.map((record: any, index: number) => (
                                                            <tr role='row' key={index}>
                                                                <td role="cell" className="ps-3">
                                                                    <div className="mb-1">
                                                                        <div className="form-check form-check-custom form-check-solid">
                                                                            <input className="form-check-input" 
                                                                            type="checkbox" 
                                                                            value="" 
                                                                            checked={selectedProductIds.includes(record.productId)}
                                                                            onChange={() => handleCheckboxChange(record.productId)}
                                                                            id="flexCheckDefault" 
                                                                            />
                                                                            {/* <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                                Default checkbox
                                                                            </label> */}
                                                                        </div>
                                                                    </div>
                                                                  
                                                                </td>
                                                                <td role="cell" >{record.productId}</td>

                                                                <td>
                                                                    <div className="d-flex align-items-center">


                                                                        <div className="ms-5">

                                                                            <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.productName}</a>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td role="cell" className="ps-3">{record.price}</td>
                                                                <td role="cell" className="ps-3">{getDateCommonFormatFromJsonDate(record?.createdOn)}</td>




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
                                    <CommonListPagination
                                        pageNo={pageBasicInfo.pageNo}
                                        pageSize={pageBasicInfo.pageSize}
                                        totalRecords={pageBasicInfo.totalRecords}
                                        goToPage={handleGoToPage}
                                    />




                                </KTCardBody>


                            </KTCard>
                        </div>


                    </div>

                </div>

                <div className='admin-modal-footer'>
                    <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>

                    <button className="btn btn-danger" type='button' onClick={handleAddSelected}>Add to Discount</button>
                </div>

            </div>


        </ReactModal>
    )
}

export default ProductsListForDiscountModal;