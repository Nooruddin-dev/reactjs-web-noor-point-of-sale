import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { APP_BASIC_CONSTANTS } from '../../../../../_poscommon/common/constants/Config';
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig';
import { createOrderStatusOptionsForDropDown, getDateCommonFormatFromJsonDate } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { GetDefaultCurrencySymbol, buildUrlParamsForSearch, getOrderStatusClass } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { getCashierOrdersListApi, getOrderStatusTypesApi, updateOrderStatusApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import AdminPageHeader from '../../components/layout/AdminPageHeader';
import { Content } from '../../../../../_poscommon/admin/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrl } from '../../../../../_poscommon/admin/helpers';
import CommonListSearchHeader from '../../../common/components/CommonListSearchHeader';
import { orderTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums';
import { Link } from 'react-router-dom';
import CommonListPagination from '../../../common/components/CommonListPagination';
import OrderStatusCommonForm from '../../../common/components/sale/OrderStatusCommonForm';


export default function AdminOrdersPage() {
    const  customerId  = 0;
    const isLoading = false;

    // ✅-- Starts: necessary varaibles for the page
    const [isOpenOrderStatusForm, setIsOpenOrderStatusForm] = useState<boolean>(false);
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0,
            customerId: customerId ?? 0
        }
    );

    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const [allOrders, setAllOrders] = useState<any>([]);
    const [allOrderStatuese, setAllOrderStatuese] = useState<any>([]);
    const [orderStatusEditForm, setOrderStatusEditForm] = useState<any>(null); // Data of the order status being edited
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'OrderIdSearch', inputName: 'OrderIdSearch', labelName: 'Order ID', placeHolder: 'Order ID', type: 'search', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'CustomerNameSearch', inputName: 'CustomerNameSearch', labelName: 'Customer Name', placeHolder: 'Customer Name', type: customerId && customerId > 0 ? 'hidden' : 'search', defaultValue: '', iconClass: 'fa fa-search' },
        {
            inputId: 'latestStatusIdSearch',
            inputName: 'latestStatusIdSearch',
            labelName: 'Status',
            placeHolder: 'Status',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: createOrderStatusOptionsForDropDown(allOrderStatuese),
        },
        {
            inputId: 'timeRangeSearch',
            inputName: 'timeRangeSearch',
            labelName: 'Date Range',
            placeHolder: 'Date Range',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: [
                { text: 'Select date range', value: '-999' },
                { text: 'Last one hour', value: '1h' },
                { text: 'Today', value: 'today' },
                { text: 'Last one week', value: '1w' },
                { text: 'One month', value: '1m' },
                { text: '6 months', value: '6m' },
                { text: '1 year', value: '1y' }

            ],
            icon: <FontAwesomeIcon icon={faClock} className='fs-2 position-absolute ms-6' style={{ color: "#99A1B7" }} />, // Different icon component


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


    const handleOpenCloseOrderStatusFormModal = () => {
        setIsOpenOrderStatusForm(!isOpenOrderStatusForm);
        setOrderStatusEditForm(null);
    }

    const handleOrderStatusEditForm = (e: any, id: number) => {

        e.preventDefault();




        const recordForEdit = allOrders?.find((x: { orderId: number }) => x.orderId == id);

        setOrderStatusEditForm({
            orderIdStatusEditForm: recordForEdit?.orderId,
            orderStatusIdForUpdate: recordForEdit?.latestStatusId,

        });

        setIsOpenOrderStatusForm(!isOpenOrderStatusForm);
    }

    const updateOrderStatusService = (data: any) => {
        console.log('order status data: ', data); // Handle form submission here
        const { orderIdStatusEditForm, orderStatusIdForUpdate } = data;
        if (stringIsNullOrWhiteSpace(orderIdStatusEditForm) || orderIdStatusEditForm < 1) {
            showErrorMsg('Invalid order id');
            return;
        }

        if (stringIsNullOrWhiteSpace(orderStatusIdForUpdate) || orderStatusIdForUpdate < 1) {
            showErrorMsg('Please select order status');
            return;
        }


        const formData = {
            orderId: stringIsNullOrWhiteSpace(orderIdStatusEditForm) ? 0 : orderIdStatusEditForm,
            LatestStatusId: orderStatusIdForUpdate,

        }


        updateOrderStatusApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenOrderStatusForm(false);
                        setSearchFormQueryParams('');
                        setListRefreshCounter(prevCounter => prevCounter + 1);
                    }, 500);

                } else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });

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
        getCashierOrdersListService();
    }, [listRefreshCounter]);

    const getCashierOrdersListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getCashierOrdersListApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllOrders(res?.data);

                } else {
                    setAllOrders([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    useEffect(() => {
        getOrderStatusesService();
    }, []);


    const getOrderStatusesService = () => {
        const pageBasicInfoOrderStatus = {

        }
        const pageBasicInfoParamsOrderStatus = new URLSearchParams(pageBasicInfoOrderStatus).toString();

        getOrderStatusTypesApi(pageBasicInfoParamsOrderStatus)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {

                    setAllOrderStatuese(res?.data);

                } else {
                    setAllOrderStatuese([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <>
            <AdminLayout>
                <>
                    <AdminPageHeader
                        title='Orders List'
                        pageDescription='Orders List'
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
                                                <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Order ID</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Customer</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Order Date</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Type</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Total Amount</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Payment Method</th>
                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Total Items</th>
                                                <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-600 fw-bold'>
                                            {
                                                allOrders != undefined && allOrders.length > 0
                                                    ?
                                                    allOrders?.map((record: any) => (
                                                        <tr>
                                                            <td className="ps-3">
                                                                <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                    {record.orderNumber}
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='symbol symbol-50px me-5'>
                                                                        <span className='symbol-label bg-light'>
                                                                            <img
                                                                                src={toAbsoluteUrl('media/svg/avatars/001-boy.svg')}
                                                                                className='h-75 align-self-end'
                                                                                alt=''
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className='d-flex justify-content-start flex-column'>
                                                                        <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                                                                            {record.customerName}
                                                                        </a>
                                                                        <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                            {record.customerMobileNo}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                    {getDateCommonFormatFromJsonDate(record.orderDateUtc)}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className={getOrderStatusClass(record.latestStatusId)}>{record.latestStatusName}</span>

                                                            </td>


                                                            <td>
                                                                {
                                                                    record.diningOption == orderTypesConst.TAKE_AWAY
                                                                        ?
                                                                        <div className='label'>
                                                                            <img src={toAbsoluteUrl('media/svg/coins/ethereum.svg')} alt='flag' className='w-20px rounded-circle me-2' />
                                                                            <span>Take Away</span>
                                                                        </div>

                                                                        :
                                                                        <div className='label'>
                                                                            <img src={toAbsoluteUrl('media/svg/coins/filecoin.svg')} alt='flag' className='w-20px rounded-circle me-2' />
                                                                            <span>Dine In</span>
                                                                        </div>

                                                                }

                                                            </td>

                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{GetDefaultCurrencySymbol()}{record.orderTotal}</td>

                                                            <td>
                                                                <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                    {record.paymentMethodName}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {record.orderTotalItems}
                                                            </td>
                                                            <td className='text-end pe-3'>
                                                                <button

                                                                    onClick={(e) => handleOrderStatusEditForm(e, record.orderId)}
                                                                    className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                                                                >
                                                                    <KTIcon iconName='pencil' className='fs-3' />

                                                                    Change Status
                                                                </button>



                                                                <Link
                                                                    to={`/admin/order-detail/${record.orderId}`}
                                                                    className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                                                                >
                                                                    <KTIcon iconName='eye' className='fs-3' />

                                                                    View
                                                                </Link>

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




                                {
                                    isOpenOrderStatusForm == true
                                        ?

                                        <OrderStatusCommonForm
                                            isOpen={isOpenOrderStatusForm}
                                            closeModal={handleOpenCloseOrderStatusFormModal}
                                            defaultValues={orderStatusEditForm}
                                            onSubmit={updateOrderStatusService}
                                            orderStatusesList={allOrderStatuese}
                                        />
                                        :
                                        <>
                                        </>
                                }


                            </KTCardBody>
                        </KTCard>

                    </Content>
                </>
            </AdminLayout>


        </>
    )
}
