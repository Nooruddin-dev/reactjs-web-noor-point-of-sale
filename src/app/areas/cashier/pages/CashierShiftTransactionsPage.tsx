/* eslint-disable */

import React, { useEffect, useState } from 'react'

import { Content } from '../../../../_poscommon/admin/layout/components/content'

import { KTCard, KTCardBody } from '../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../common/components/CommonListSearchHeader'
import CommonListPagination from '../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper'
import { orderStatusesConst, shiftCashDrawerReconciliationStatusesConst, sqlDeleteTypesConst } from '../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../_poscommon/common/constants/dBEntitiesConst'
import CashierLayout from '../components/CashierLayout'
import CashierPageHeader from '../components/layout/CashierPageHeader'
import { Link } from 'react-router-dom'
import { SearchHeaderButtonHtmlType } from '../../../models/common/SearchHeaderButtonHtmlType'
import { checkIfAnyActiveShiftExistsApi, getCashierShiftDrawerInfoApi, getShiftCashDrawerReconciliationStatusesApi, getShiftCashTransactionDataApi, getShiftCashTransactionTypesApi, getShiftNameListServiceApi, insertUpdateCashDrawerTransactionApi, insertUpdateCashierShiftDrawerApi, insertUpdateColorApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import CashierShiftMasterAddEditForm from '../components/users-management/CashierShiftMasterAddEditForm'
import { createShiftCashTransactionTypesForDropDown, getDateCommonFormatFromJsonDate } from '../../../../_poscommon/common/helpers/global/ConversionHelper'
import CashierCashDrawerTransactionAddEditForm from '../components/users-management/CashierCashDrawerTransactionAddEditForm'




export default function CashierShiftTransactionsPage() {
    const isLoading = false;

    const [allShiftTransactions, setAllShiftTransactions] = useState<any>([]);
    const [allShiftCashTransactionTypes, setAllShiftCashTransactionTypes] = useState<any>([]);

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

    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'TransactionIdSearch', inputName: 'TransactionIdSearch', labelName: 'Transaction ID', placeHolder: 'Transaction ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'CashDrawerIdSearch', inputName: 'CashDrawerIdSearch', labelName: 'Cash Drawer ID', placeHolder: 'Cash Drawer ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'ShiftIdSearch', inputName: 'ShiftIdSearch', labelName: 'Shift ID', placeHolder: 'Shift ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        {
            inputId: 'CashTransactionTypeIdSearch',
            inputName: 'CashTransactionTypeIdSearch',
            labelName: 'Cash Transaction Type',
            placeHolder: 'Cash Transaction Type',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: createShiftCashTransactionTypesForDropDown(allShiftCashTransactionTypes),
        },
        { inputId: 'FromDateSearch', inputName: 'FromDateSearch', labelName: 'From Date', placeHolder: 'From Date', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'ToDateSearch', inputName: 'ToDateSearch', labelName: 'To Date', placeHolder: 'To Date', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },



    ];

    const [shiftMasterEditForm, setShiftMasterEditForm] = useState<any>(null); // Data of the category being edited
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

    const handleShiftCashTransactionEditClick = (e: Event, id: number) => {

        e.preventDefault();
        const recordForEdit = allShiftTransactions?.find((x: { transactionId: number }) => x.transactionId == id);

        setShiftMasterEditForm({
            transactionIdEditForm: recordForEdit?.transactionId,
            cashDrawerId: recordForEdit?.cashDrawerId ?? 0,
            cashTransactionTypeId: recordForEdit?.cashTransactionTypeId ?? 0,
            amount: recordForEdit?.amount ?? null,
            description: recordForEdit?.description ?? null,
            startingCash: recordForEdit?.startingCash ?? null,
            transactionDate: recordForEdit?.transactionDate ?? null,
            orderId: recordForEdit?.orderId ?? null,

        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }




    const insertUpdateCashTransactionService = (data: any) => {
        console.log('data transactions: ', data); // Handle form submission here
        const { transactionIdEditForm, cashDrawerId, cashTransactionTypeId, amount, description, transactionDate, orderId } = data;



        if (stringIsNullOrWhiteSpace(cashDrawerId) || cashDrawerId < 1) {
            showErrorMsg('Cash drawer ID is required');
            return;
        }


        if (stringIsNullOrWhiteSpace(cashTransactionTypeId) || cashTransactionTypeId < 1) {
            showErrorMsg('Cash transaction type is required');
            return;
        }


        if (stringIsNullOrWhiteSpace(amount) || amount < 1) {
            showErrorMsg('Amount is required');
            return;
        }

        if (stringIsNullOrWhiteSpace(description)) {
            showErrorMsg('Description is required');
            return;
        }

        if (stringIsNullOrWhiteSpace(transactionDate)) {
            showErrorMsg('Transaction Date is required');
            return;
        }



        let transactionId = stringIsNullOrWhiteSpace(transactionIdEditForm) ? 0 : transactionIdEditForm;

        let formData = {
            transactionId: transactionId,

            cashDrawerId: stringIsNullOrWhiteSpace(cashDrawerId) ? 0 : cashDrawerId,
            cashTransactionTypeId: stringIsNullOrWhiteSpace(cashTransactionTypeId) ? 0 : cashTransactionTypeId,
            amount: stringIsNullOrWhiteSpace(amount) ? 0 : amount,
            description: stringIsNullOrWhiteSpace(description) ? null : description,
            transactionDate: stringIsNullOrWhiteSpace(transactionDate) ? null : transactionDate,
            orderId: stringIsNullOrWhiteSpace(orderId) ? null : orderId,

        }




        insertUpdateCashDrawerTransactionApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenAddNewForm(false);
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



    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setShiftMasterEditForm(null);
    }





    useEffect(() => {
        getShiftCashTransactionDataService();
    }, [listRefreshCounter]);

    const getShiftCashTransactionDataService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getShiftCashTransactionDataApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllShiftTransactions(res?.data);

                } else {
                    setAllShiftTransactions([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    useEffect(() => {

        const getShiftCashTransactionTypesService = () => {
            const pageBasicInfoOrderStatus = {

            }
            const pageBasicInfoParamsOrderStatus = new URLSearchParams(pageBasicInfoOrderStatus).toString();

            getShiftCashTransactionTypesApi(pageBasicInfoParamsOrderStatus)
                .then((res: any) => {
                    const { data } = res;
                    if (data && data.length > 0) {

                        setAllShiftCashTransactionTypes(res?.data);

                    } else {
                        setAllShiftCashTransactionTypes([]);
                    }


                })
                .catch((err: any) => console.log(err, "err"));
        };


        getShiftCashTransactionTypesService();
    }, []);





    return (
        <CashierLayout>
            <CashierPageHeader
                title='Shift Cash Transactions'
                pageDescription='Shift Cash Transactions'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={handleOpenCloseAddModal}
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
                                    <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light'>
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Transaction Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Cash Transaction Type Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Amount</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Description</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Transaction Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Cash Drawer ID</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Shift Id</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allShiftTransactions != undefined && allShiftTransactions.length > 0
                                            ?
                                            allShiftTransactions?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.transactionId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.cashTransactionTypeName}</a>

                                                            </div>
                                                        </div>
                                                    </td>


                                                    <td role="cell" className="">{record.amount}</td>
                                                    <td role="cell" className="">{record.description}</td>
                                                    <td role="cell" className="">
                                                        {getDateCommonFormatFromJsonDate(record.transactionDate)}
                                                    </td>

                                                    <td role="cell" className="">{record.cashDrawerId}</td>
                                                    <td role="cell" className="">{record.orderId}</td>
                                                    <td role="cell" className="pe-3">{record.shiftId}</td>



                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={handleShiftCashTransactionEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.transactionId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: false,
                                                                entityRowId: record.transactionId,
                                                                entityName: dBEntitiesConst.ShiftCashTransactions.tableName,
                                                                entityColumnName: dBEntitiesConst.ShiftCashTransactions.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.plainTableDelete,
                                                                deleteModalTitle: 'Delete Transaction'
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

                        {
                            isOpenAddNewForm == true
                                ?

                                <CashierCashDrawerTransactionAddEditForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    defaultValues={shiftMasterEditForm}
                                    onSubmit={insertUpdateCashTransactionService}
                                    allShiftCashTransactionTypes={allShiftCashTransactionTypes} />
                                :
                                <>
                                </>
                        }



                    </KTCardBody>
                </KTCard>
            </Content>


        </CashierLayout>
    )
}
