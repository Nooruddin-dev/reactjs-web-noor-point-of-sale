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
import { checkIfAnyActiveShiftExistsApi, getCashierShiftDrawerInfoApi, getShiftCashDrawerReconciliationStatusesApi, getShiftNameListServiceApi, insertUpdateCashierShiftDrawerApi, insertUpdateColorApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import CashierShiftMasterAddEditForm from '../components/users-management/CashierShiftMasterAddEditForm'
import { getDateCommonFormatFromJsonDate } from '../../../../_poscommon/common/helpers/global/ConversionHelper'




export default function CashierShiftManagementPage() {
    const isLoading = false;

    const [allShiftNames, setAllShiftNames] = useState<any>([]);
    const [allReconciliationStatuses, setAllReconciliationStatuses] = useState<any>([]);

    // ✅-- Starts: necessary varaibles for the page
    const [isOpenStartShiftAddForm, setIsOpenStartShiftAddForm] = useState<boolean>(false);
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );

    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const [allShiftMaster, setAllShiftMaster] = useState<any>([]);
    const [activeShiftExists, setActiveShiftExists] = useState<boolean>(false);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'ShiftIdSearch', inputName: 'ShiftIdSearch', labelName: 'Shift ID', placeHolder: 'Shift ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'CashierNameSearch', inputName: 'CashierNameSearch', labelName: 'Cashier Name', placeHolder: 'Cashier Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

        {
            inputId: 'ShiftStatusIdSearch',
            inputName: 'ShiftStatusIdSearch',
            labelName: 'Shift Status',
            placeHolder: 'Shift Status',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: [
                { text: 'Select shift status', value: '-999' },
                { text: 'Active', value: '1' },
                { text: 'Ended', value: '0' },
              
            ]
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

    const handleShiftMasterEditClick = (e: Event, id: number) => {

        e.preventDefault();
        const recordForEdit = allShiftMaster?.find((x: { shiftCashDrawerId: number }) => x.shiftCashDrawerId == id);

        setShiftMasterEditForm({
            shiftCashDrawerIdEditForm: recordForEdit?.shiftCashDrawerId,
            shiftId: recordForEdit?.shiftId ?? 0,
            shiftNameId: recordForEdit?.shiftNameId ?? 0,
            shiftStartedAt: recordForEdit?.shiftStartedAt ?? null,
            shiftEndedAt: recordForEdit?.shiftEndedAt ?? null,
            startingCash: recordForEdit?.startingCash ?? null,
            endingCash: recordForEdit?.endingCash ?? null,
            reconciliationStatusId: recordForEdit?.reconciliationStatusId ?? null,
            reconciliationComments: recordForEdit?.reconciliationComments,

        });



        setIsOpenStartShiftAddForm(!isOpenStartShiftAddForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }




    const insertUpdateShiftMasterDrawerService = (data: any) => {
        console.log('data color: ', data); // Handle form submission here
        const { shiftCashDrawerIdEditForm, shiftId, shiftNameId, shiftStartedAt, shiftEndedAt, startingCash, endingCash, reconciliationStatusId, reconciliationComments } = data;



        if (stringIsNullOrWhiteSpace(shiftNameId) || stringIsNullOrWhiteSpace(shiftStartedAt)) {
            showErrorMsg('Please fill all required fields');
            return;
        }

        if (startingCash == undefined || startingCash == null || startingCash < 1) {
            showErrorMsg('Please select starting cash');
            return;
        }

        if (reconciliationStatusId == undefined || reconciliationStatusId == null || reconciliationStatusId < 1) {
            showErrorMsg('Please select reconciliation status');
            return;
        }


        let shiftCashDrawerId = stringIsNullOrWhiteSpace(shiftCashDrawerIdEditForm) ? 0 : shiftCashDrawerIdEditForm;

        let formData = {
            shiftCashDrawerId: shiftCashDrawerId,
            shiftNameId: shiftNameId,
            shiftStartedAt: shiftStartedAt,
            shiftEndedAt: stringIsNullOrWhiteSpace(shiftEndedAt) ? null : shiftEndedAt,
            startingCash: stringIsNullOrWhiteSpace(startingCash) ? 0 : startingCash,
            endingCash: stringIsNullOrWhiteSpace(endingCash) ? 0 : endingCash,
            reconciliationStatusId: stringIsNullOrWhiteSpace(reconciliationStatusId) ? null : reconciliationStatusId,
            reconciliationComments: reconciliationComments,
            shiftId: stringIsNullOrWhiteSpace(shiftId) ? null : shiftId,

        }


        insertUpdateCashierShiftDrawerApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenStartShiftAddForm(false);
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



    const handleOpenCloseShiftStartClick = () => {

        //--if start shift button clicked
        if(isOpenStartShiftAddForm == false && activeShiftExists == true){
          showErrorMsg('There is already an active shift exists. Please first end the shift then start new shift.');
          return false;
        }

        setIsOpenStartShiftAddForm(!isOpenStartShiftAddForm);
        setShiftMasterEditForm(null);
    }

    const getReconcillationStatusClass = (reconciliationStatusId: number) => {
        switch (reconciliationStatusId) {
            case shiftCashDrawerReconciliationStatusesConst.Balanced:
                return 'badge badge-light-success';
            case shiftCashDrawerReconciliationStatusesConst.Over:
                return 'badge badge-light-warning';
            case shiftCashDrawerReconciliationStatusesConst.Under:
                return 'badge badge-light-info';

            default:
                return 'badge badge-light-info'; // Return an empty string or a default class if needed
        }
    }




    const isShiftStarted: any = true;
    const headerOtherButtons: SearchHeaderButtonHtmlType[] = [
        {
            buttonHtml: <>  <Link to='#' onClick={handleOpenCloseShiftStartClick} className='btn btn-sm fw-bold  btn-danger ms-2'> Start Shift </Link> </>
        }
    ];

    useEffect(() => {
        getCashierShiftDrawerInfoService();
        checkIfAnyActiveShiftExistsService();
    }, [listRefreshCounter]);

    const getCashierShiftDrawerInfoService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getCashierShiftDrawerInfoApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllShiftMaster(res?.data);

                } else {
                    setAllShiftMaster([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    const checkIfAnyActiveShiftExistsService = () => {

      

        checkIfAnyActiveShiftExistsApi()
            .then((res: any) => {
                const { data } = res;
                if (data && data.activeShiftsExists == true) {
                    
                    setActiveShiftExists(true);
                  
                } else {
                    setActiveShiftExists(false);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    useEffect(() => {

        const getShiftNameListService = () => {

            let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
            if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
                pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
            }

            getShiftNameListServiceApi(pageBasicInfoParams)
                .then((res: any) => {
                    const { data } = res;
                    if (data && data.length > 0) {

                        setAllShiftNames(res?.data);

                    } else {
                        setAllShiftNames([]);
                    }
                })
                .catch((err: any) => console.log(err, "err"));
        };

        const getShiftCashDrawerReconciliationStatusesService = () => {

            let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
            if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
                pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
            }

            getShiftCashDrawerReconciliationStatusesApi(pageBasicInfoParams)
                .then((res: any) => {
                    const { data } = res;
                    if (data && data.length > 0) {

                        setAllReconciliationStatuses(res?.data);

                    } else {
                        setAllReconciliationStatuses([]);
                    }
                })
                .catch((err: any) => console.log(err, "err"));
        };

        getShiftNameListService();
        getShiftCashDrawerReconciliationStatusesService();
    }, []);


    return (
        <CashierLayout>
            <CashierPageHeader
                title='Shift Management'
                pageDescription='Shift Management'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false,
                    headerOtherButtons: (isShiftStarted == true ? headerOtherButtons : null)
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Shift Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Start by Cashier Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Shift Start Time</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Shift End Time</th>


                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Starting Cash</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Ending Cash</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Reconciliation Status</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Reconciliation Comment</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Shift Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allShiftMaster != undefined && allShiftMaster.length > 0
                                            ?
                                            allShiftMaster?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">{record.shiftCashDrawerId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.startedByFirstName} {record.startedByLastName}</a>

                                                            </div>
                                                        </div>
                                                    </td>


                                                    <td role="cell" className="">

                                                        {getDateCommonFormatFromJsonDate(record.shiftStartedAt, true)}
                                                    </td>
                                                    <td role="cell" className="">  {getDateCommonFormatFromJsonDate(record.shiftEndedAt, true)}</td>

                                                    <td role="cell" className="">{record.startingCash}</td>
                                                    <td role="cell" className="">{record.endingCash}</td>

                                                    <td role="cell" className="">  <span className={getReconcillationStatusClass(record.reconciliationStatusId)}>{record.reconciliationStatusName}</span></td>
                                                    <td role="cell" className="">{record.reconciliationComments}</td>

                                                    {
                                                        stringIsNullOrWhiteSpace(record.shiftEndedAt) == true
                                                            ?
                                                            <td role="cell" className=""> <div className="badge badge-light-danger fw-bolder">Active</div></td>

                                                            :
                                                            <td role="cell" className=""> <div className="badge badge-light-success fw-bolder">Ended</div></td>

                                                    }

                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={handleShiftMasterEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.shiftCashDrawerId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: false,
                                                                entityRowId: record.shiftCashDrawerId,
                                                                entityName: dBEntitiesConst.ShiftCashDrawer.tableName,
                                                                entityColumnName: dBEntitiesConst.ShiftCashDrawer.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete Shift Drawer Data'
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
                            isOpenStartShiftAddForm == true
                                ?

                                <CashierShiftMasterAddEditForm
                                    isOpen={isOpenStartShiftAddForm}
                                    closeModal={handleOpenCloseShiftStartClick}
                                    defaultValues={shiftMasterEditForm}
                                    onSubmit={insertUpdateShiftMasterDrawerService}
                                    allShiftNames={allShiftNames}
                                    allReconciliationStatuses={allReconciliationStatuses} />
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
