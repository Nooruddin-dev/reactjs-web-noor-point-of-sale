/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../components/layout/AdminPageHeader'
import { KTCard, KTCardBody } from '../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../common/components/CommonListSearchHeader'
import CommonListPagination from '../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper'
import { sqlDeleteTypesConst } from '../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../_poscommon/common/constants/dBEntitiesConst'
import { getManufacturerListApi, insertUpdateManufacturerApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import ManufacturerAddUpdateForm from '../components/productsCataglog/ManufacturerAddUpdateForm'



export default function AdminManufacturersPage() {
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
    const [allManufacturers, setAllManufacturers] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'ManufacturerIdSearch', inputName: 'ManufacturerIdSearch', labelName: 'Manufacturer ID', placeHolder: 'Manufacturer ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'NameSearch', inputName: 'NameSearch', labelName: 'Name', placeHolder: 'Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

    ];
    const [manufacturerEditForm, setManufacturerEditForm] = useState<any>(null); // Data of the category being edited
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

    const handleManufacturerEditClick = (e: Event, id: number) => {

        e.preventDefault();
        const recordForEdit = allManufacturers?.find((x: { manufacturerId: number }) => x.manufacturerId == id);

        setManufacturerEditForm({
            manufacturerIdEditForm: recordForEdit?.manufacturerId,
            name: recordForEdit?.name,
            isActive: recordForEdit?.isActive == true ? '1' : '0',
        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setManufacturerEditForm(null);
    }

    const insertUpdateManufacturerService = (data: any) => {
        console.log('data manufacturer: ', data); // Handle form submission here
        const { manufacturerIdEditForm, name, isActive } = data;
        if (stringIsNullOrWhiteSpace(name) || stringIsNullOrWhiteSpace(isActive)) {
            showErrorMsg('Please fill all required fields');
            return;
        }


        let formData = {
            manufacturerId: stringIsNullOrWhiteSpace(manufacturerIdEditForm) ? 0 : manufacturerIdEditForm,
            name: name,
            isActive: isActive?.toString() == "1" ? true : false,
        }


        insertUpdateManufacturerApi(formData)
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

    useEffect(() => {
        getManufacturerListService();
    }, [listRefreshCounter]);

    const getManufacturerListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getManufacturerListApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllManufacturers(res?.data);

                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Manufacturers List'
                pageDescription='Manufacturers List'
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
                                    <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Manufacturer Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allManufacturers != undefined && allManufacturers.length > 0
                                            ?
                                            allManufacturers?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.manufacturerId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.name}</a>

                                                            </div>
                                                        </div>
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
                                                            onEditClick={handleManufacturerEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.manufacturerId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.manufacturerId,
                                                                entityName: dBEntitiesConst.Manufacturers.tableName,
                                                                entityColumnName: dBEntitiesConst.Manufacturers.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.plainTableDelete,
                                                                deleteModalTitle: 'Delete Manufacturer'
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

                                <ManufacturerAddUpdateForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    defaultValues={manufacturerEditForm}
                                    onSubmit={insertUpdateManufacturerService}
                                />
                                :
                                <>
                                </>
                        }



                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    )
}
