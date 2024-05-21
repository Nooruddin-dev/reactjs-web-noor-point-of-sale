/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../components/layout/AdminPageHeader'
import { KTCard, KTCardBody, toAbsoluteUrlCustom } from '../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../common/components/CommonListSearchHeader'
import CommonListPagination from '../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import { stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper'
import { sqlDeleteTypesConst } from '../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../_poscommon/common/constants/dBEntitiesConst'
import { useNavigate } from 'react-router'
import { getProductsListApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'


export default function AdminProductsPage() {
    const navigate = useNavigate();
    const isLoading = false;

    // ✅-- Starts: necessary varaibles for the page
    const [isOpenAddNewForm, setIsOpenAddNewForm] = useState<boolean>(false);
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );

    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const [productAllList, setProductAllList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'productIdSearch', inputName: 'productIdSearch', labelName: 'Product ID', placeHolder: 'Product ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'productNameSearch', inputName: 'productNameSearch', labelName: 'Product Name', placeHolder: 'Product Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        {
            inputId: 'isActiveSearch',
            inputName: 'isActiveSearch',
            labelName: 'Product Status',
            placeHolder: 'Product Status',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: [
                { text: 'Select status', value: '-999' },
                { text: 'Active', value: 'true' },
                { text: 'In Active', value: 'false' },

            ],
        },

    ];
    // ✅-- Ends: necessary varaibles for the page


    const handleSearchForm = (updatedSearchFields: HtmlSearchFieldConfig) => {
        const queryUrl = buildUrlParamsForSearch(updatedSearchFields);
        setSearchFormQueryParams(queryUrl);
        

        //--reset pageNo to 1
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: 1 // Update only the pageNo property
        }));

        setTimeout(() => {
            setListRefreshCounter(prevCounter => prevCounter + 1);
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
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleProductEditClick = (e: Event, id: number) => {

        e.preventDefault();
        navigate(`/admin/update-product/${id}`);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };

    useEffect(() => {
        getProductsListService();
    }, [listRefreshCounter]);

    const getProductsListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }
        

        getProductsListApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                }
                setProductAllList(res?.data);

            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Products List'
                pageDescription='Products List'
                addNewClickType={'link'}
                newLink={'/admin/create-product'}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: true
                }
            }
            />

            <Content>
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
                                    <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light '>
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Product Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Product Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>SKU</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end " style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        productAllList != undefined && productAllList.length > 0
                                            ?
                                            productAllList?.map((record: any) => (
                                                <tr role='row' key={record.productId}>
                                                    <td role="cell" className="ps-3">{record.productId}</td>

                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            <a href="/metronic8/demo1/apps/ecommerce/catalog/edit-product.html" className="symbol symbol-50px">
                                                                <span className="symbol-label"
                                                                    style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.productDefaultImgPath)})` }}
                                                                ></span>
                                                            </a>


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.productName}</a>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record.sku}</div>
                                                    </td>




                                                    {
                                                        record.isActive == true
                                                            ?
                                                            <td role="cell" className=""> <div className="badge badge-light-success fw-bolder">Active</div></td>

                                                            :
                                                            <td role="cell" className=""> <div className="badge badge-light-danger fw-bolder">Inactive</div></td>
                                                    }

                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={handleProductEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.productId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.productId,
                                                                entityName: dBEntitiesConst.Products.tableName,
                                                                entityColumnName: dBEntitiesConst.Products.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete Product'
                                                            }} />
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
                        <CommonListPagination
                            pageNo={pageBasicInfo.pageNo}
                            pageSize={pageBasicInfo.pageSize}
                            totalRecords={pageBasicInfo.totalRecords}
                            goToPage={handleGoToPage}
                        />





                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    )
}
