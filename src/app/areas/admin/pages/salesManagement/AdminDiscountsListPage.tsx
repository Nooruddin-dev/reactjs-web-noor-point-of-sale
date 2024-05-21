/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Content } from '../../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../../components/layout/AdminPageHeader'
import { KTCard, KTCardBody, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../../common/components/CommonListSearchHeader'
import CommonListPagination from '../../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../../_poscommon/common/constants/Config'
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper'
import { sqlDeleteTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../../_poscommon/common/constants/dBEntitiesConst'
import { useNavigate } from 'react-router'
import { getDiscountsListApi, getProductsListApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { getDateCommonFormatFromJsonDate } from '../../../../../_poscommon/common/helpers/global/ConversionHelper'


export default function AdminDiscountsListPage() {
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
    const [allDiscountsList, setAllDiscountsList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'DiscountIdSearch', inputName: 'DiscountIdSearch', labelName: 'Discount ID', placeHolder: 'Discount ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'TitleSearch', inputName: 'TitleSearch', labelName: 'Title', placeHolder: 'Title', type: 'search', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'CouponCodeSearch', inputName: 'CouponCodeSearch', labelName: 'Coupon Code', placeHolder: 'Coupon Code', type: 'search', defaultValue: '', iconClass: 'fa fa-search' },


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


    const handleDiscountEditClick = (e: Event, id: number) => {

        e.preventDefault();
        navigate(`/admin/update-discount/${id}`);
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
        getDiscountsListService();
    }, [listRefreshCounter]);

    const getDiscountsListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }
        

        getDiscountsListApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllDiscountsList(res?.data);
                }else{
                    setAllDiscountsList([]);
                }
             

            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Discounts List'
                pageDescription='Discounts List'
                addNewClickType={'link'}
                newLink={'/admin/create-discount'}
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Discount Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Title</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Discount Type</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Discount Valye Type</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Discount Value</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Start Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>End Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Coupon Code</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end " style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allDiscountsList != undefined && allDiscountsList.length > 0
                                            ?
                                            allDiscountsList?.map((record: any) => (
                                                <tr role='row' key={record.discountId}>
                                                    <td role="cell" className="ps-3">{record.discountId}</td>

                                                 

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record.title}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record.discountTypeName}</div>
                                                    </td>


                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record.discountValueType}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record.discountValue}</div>
                                                    </td>


                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{getDateCommonFormatFromJsonDate(record.startDate)}</div>
                                                    </td>


                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{getDateCommonFormatFromJsonDate(record.endDate)}</div>
                                                    </td>


                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record.couponCode}</div>
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
                                                            onEditClick={handleDiscountEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.discountId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.discountId,
                                                                entityName: dBEntitiesConst.Discounts.tableName,
                                                                entityColumnName: dBEntitiesConst.Discounts.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete Discount'
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
