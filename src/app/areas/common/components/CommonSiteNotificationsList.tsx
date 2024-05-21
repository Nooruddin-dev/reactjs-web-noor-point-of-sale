import React, { useEffect, useState } from 'react'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import { KTCard, KTCardBody } from '../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from './CommonListSearchHeader'
import CommonListPagination from './CommonListPagination'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper'
import { getSiteGeneralNotificationsApi, markNotificationAsReadApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { CommonTableActionCell } from './CommonTableActionCell'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../_poscommon/common/helpers/global/GlobalHelper'
import dBEntitiesConst from '../../../../_poscommon/common/constants/dBEntitiesConst'
import { sqlDeleteTypesConst } from '../../../../_poscommon/common/enums/GlobalEnums'

export default function CommonSiteNotificationsList() {

    const [siteGeneralNotifications, setSiteGeneralNotifications] = useState<any>([])

    // ✅-- Starts: necessary varaibles for the page
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
        { inputId: 'notificationIdSearch', inputName: 'notificationIdSearch', labelName: 'Notification ID', placeHolder: 'Notification ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        {
            inputId: 'isReadNullPropertySearch',
            inputName: 'isReadNullPropertySearch',
            labelName: 'Status',
            placeHolder: 'Status',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: [
                { text: 'Select status', value: '-999' },
                { text: 'Read', value: 'true' },
                { text: 'Un Read', value: 'false' },

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


    const markNotificationAsRead = (event: any, notificationId: number) => {
        event.preventDefault()

        const formData = {
            notificationId: notificationId
       
        }


        markNotificationAsReadApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setSearchFormQueryParams('');
                        setListRefreshCounter(prevCounter => prevCounter + 1);
                    }, 500);

                } else if (res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
                    showErrorMsg(res?.data?.response?.responseMessage);
                }
                else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });
    }


    useEffect(() => {
        getSiteGeneralNotificationsService();
    }, [listRefreshCounter]);

    const getSiteGeneralNotificationsService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getSiteGeneralNotificationsApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setSiteGeneralNotifications(res?.data);

                } else {
                    setSiteGeneralNotifications([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };




    return (
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
                                <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                    <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Notification Id</th>
                                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Read Status</th>
                                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Title</th>
                                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Message</th>
                                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Read By</th>
                                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Type</th>
                                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}></th>
                                    <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-600 fw-bold'>

                                {
                                    siteGeneralNotifications != undefined && siteGeneralNotifications.length > 0
                                        ?
                                        siteGeneralNotifications?.map((record: any) => (
                                            <tr role='row'>
                                                <td role="cell" className="ps-3">{record.notificationId}</td>
                                                <td role="cell" className="">
                                                    {
                                                        record?.isRead == true
                                                            ?
                                                            <div className="symbol symbol-circle symbol-25px">
                                                                <div className="symbol-label fs-8 fw-bold bg-success text-inverse-primary">
                                                                    R
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="symbol symbol-circle symbol-25px">
                                                                <div className="symbol-label fs-8 fw-bold bg-primary text-inverse-primary">
                                                                    UR
                                                                </div>
                                                            </div>
                                                    }


                                                </td>
                                                <td role="cell" className="">{record.title}</td>
                                                <td role="cell" className="">{record.message}</td>
                                                <td role="cell" className="">{record.readByFirstName}</td>
                                                <td role="cell" className="">
                                                    <span className="badge badge-light-danger"> {record.notificationTypeName}</span>
                                                </td>


                                                <td role="cell" className="">
                                                    <a className="px-4 me-1 cursor-pointer" onClick={(e) => markNotificationAsRead(e, record.notificationId)}>
                                                        <span className="badge badge-light-info fw-semibold me-1">  Mark Read</span>
                                                    </a>
                                                </td>


                                                <td role="cell" className='text-end min-w-100px pe-3'>
                                                    <CommonTableActionCell
                                                        onEditClick={undefined}
                                                        onDeleteClick={handleOnDeleteClick}
                                                        editId={record.notificationId}
                                                        showEditButton={false}
                                                        deleteData={{
                                                            showDeleteButton: true,
                                                            entityRowId: record.notificationId,
                                                            entityName: dBEntitiesConst.SiteGeneralNotifications.tableName,
                                                            entityColumnName: dBEntitiesConst.SiteGeneralNotifications.primaryKeyColumnName,
                                                            sqlDeleteTypeId: sqlDeleteTypesConst.plainTableDelete,
                                                            deleteModalTitle: 'Delete Tax Rule'
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
    )
}
