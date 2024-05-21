/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../components/layout/AdminPageHeader'
import { KTCard, KTCardBody } from '../../../../_poscommon/admin/helpers'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import {  getInvnetoryMethodsListApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'


export default function AdminInventoryMethodsPage() {
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


    const [allInventoryMethods, setallInventoryMethods] = useState<any>([]);


    // ✅-- Ends: necessary varaibles for the page



    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
     
    }


    useEffect(() => {
        getInventoryMethodsListService();
    }, [listRefreshCounter]);

    const getInventoryMethodsListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        

        getInvnetoryMethodsListApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setallInventoryMethods(res?.data);

                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Inventory Methods'
                pageDescription='Inventory Methods'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={handleOpenCloseAddModal}
                additionalInfo={{
                    showAddNewButton: false
                }
            }
            />

            <Content>
                <KTCard>

                   
                    {/* <UsersTable /> */}
                    <KTCardBody className='py-4'>
                        <div className='table-responsive'>
                            <table
                                id='kt_table_users'
                                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                            >
                                <thead>
                                    <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Inventory Method Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Method Name</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Status</th>
                                     
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allInventoryMethods != undefined && allInventoryMethods.length > 0
                                            ?
                                            allInventoryMethods?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.inventoryMethodId}</td>




                                                  

                                                    <td role="cell" className="">{record.inventoryMethodName}</td>




                                                    {
                                                        record.isActive == true
                                                            ?
                                                            <td role="cell" className="pe-3"> <div className="badge badge-light-success fw-bolder">Active</div></td>

                                                            :
                                                            <td role="cell" className="pe-3"> <div className="badge badge-light-danger fw-bolder">Inactive</div></td>
                                                    }

                                                   
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
                        {/* <CommonListPagination
                            pageNo={pageBasicInfo.pageNo}
                            pageSize={pageBasicInfo.pageSize}
                            totalRecords={pageBasicInfo.totalRecords}
                            goToPage={handleGoToPage}
                        /> */}

                       


                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    )
}
