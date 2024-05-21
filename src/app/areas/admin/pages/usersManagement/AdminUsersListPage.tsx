/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Content } from '../../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../../components/layout/AdminPageHeader'
import { KTCard, KTCardBody, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../../common/components/CommonListSearchHeader'
import TableListLoading from '../../../common/components/TableListLoading'
import CommonListPagination from '../../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig'
import CategoryAddForm from '../../components/productsCataglog/CategoryAddForm'
import { buildUrlParamsForSearch } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../../_poscommon/common/constants/Config'
import { getAllCountriesApi, getAllUsersApi, getProductCategoriesApi, inserUpdateBusinessPartnerApi, insertUpdateProductCategoryApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper'
import { dataOperationTypeConst, sqlDeleteTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../../_poscommon/common/constants/dBEntitiesConst'
import AdminUserAddForm from '../../components/usersManagement/AdminUserAddForm'


export default function AdminUsersListPage() {
    const isLoading = false;
    const [allCountries, setAllCountries] = useState<any>(null);

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
    const [allUsersList, setAllUsersList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'busnPartnerIdSearch', inputName: 'busnPartnerIdSearch', labelName: 'User ID', placeHolder: 'User ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'firstNameSearch', inputName: 'firstNameSearch', labelName: 'Name', placeHolder: 'Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
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
    const [userEditForm, setUserEditForm] = useState<any>(null); // Data of the user being edited
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

    const handleUserEditClick = (e: Event, id: number) => {
        e.preventDefault();
        const recordForEdit = allUsersList?.find((x: { busnPartnerId: number }) => x.busnPartnerId == id);

        setUserEditForm({
            busnPartnerIdEditForm: recordForEdit?.busnPartnerId,
            firstName: recordForEdit?.firstName,
            lastName: recordForEdit?.lastName,
            emailAddress: recordForEdit?.emailAddress,
            busnPartnerTypeId: recordForEdit?.busnPartnerTypeId,
            isActive: recordForEdit?.isActive == true ? '1' : '0',
            isVerified: recordForEdit?.isVerified == true ? '1' : '0',
            countryId: recordForEdit?.countryId,
            addressOne: recordForEdit?.busnPartnerAddressAssociationBusnPartners[0]?.addressOne,
            phoneNo: recordForEdit?.busnPartnerPhoneAssociation[0]?.phoneNo,
            profilePictureId: recordForEdit?.profilePictureId,

            password: recordForEdit?.testWordHooP,
            confirmPassword: recordForEdit?.testWordHooP,
        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setUserEditForm(null);
    }

    const handleUserFormSubmit = (data: any) => {
        console.log('data user: ', data); // Handle form submission here
        const { busnPartnerIdEditForm, profilePictureId, firstName, lastName, emailAddress, busnPartnerTypeId, isActive, isVerified, countryId, addressOne, phoneNo, password, confirmPassword, userProfileImage } = data;
        if (stringIsNullOrWhiteSpace(firstName) || stringIsNullOrWhiteSpace(lastName) || stringIsNullOrWhiteSpace(emailAddress) || stringIsNullOrWhiteSpace(countryId)
         || stringIsNullOrWhiteSpace(password)
         || stringIsNullOrWhiteSpace(isActive)) {
            showErrorMsg('Please fill all required fields');
            return;
        }

        if(password != confirmPassword){
            showErrorMsg('Password does not match!');
            return;
        }
        if(stringIsNullOrWhiteSpace(busnPartnerTypeId) || busnPartnerTypeId < 1){
            showErrorMsg('User type is required!');
            return;
        }


        const formData = new FormData();
        formData.append('busnPartnerId', stringIsNullOrWhiteSpace(busnPartnerIdEditForm) ? 0 : busnPartnerIdEditForm);
        formData.append('firstName', firstName ?? '');
        formData.append('lastName', lastName ?? '');
        formData.append('emailAddress', emailAddress ?? '');
        formData.append('busnPartnerTypeId', busnPartnerTypeId ?? 0);
        formData.append('IsActive', isActive?.toString() == "1" ? 'true' : 'false');
        formData.append('isVerified', isVerified?.toString() == "1" ? 'true' : 'false');
        formData.append('countryId', countryId ?? '0');
        formData.append('addressOne', addressOne ?? '');
        formData.append('phoneNo', phoneNo ?? '');
        formData.append('password', password ?? '');
     
        formData.append('userProfileImage', userProfileImage[0]); // Assuming categoryImage is a FileList
        formData.append('profilePictureId', profilePictureId ?? 0);


        inserUpdateBusinessPartnerApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenAddNewForm(false);
                        setSearchFormQueryParams('');
                        setListRefreshCounter(prevCounter => prevCounter + 1);
                    }, 500);

                }else if(res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
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

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };

    useEffect(() => {
        getAllCountriesService();
    }, []);

    const getAllCountriesService = () => {

        const pageBasicInfoCountry: any = {
            pageNo: 1,
            pageSize: 350
        }
        const pageBasicInfoCountryParams = new URLSearchParams(pageBasicInfoCountry).toString();


        getAllCountriesApi(pageBasicInfoCountryParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setAllCountries(res?.data);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    useEffect(() => {
        getAllUsersService();
    }, [listRefreshCounter]);

    const getAllUsersService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getAllUsersApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllUsersList(res?.data);

                }else{
                    setAllUsersList([]);
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: 0
                    }));
                }
              

            })
            .catch((err: any) => console.log(err, "err"));
    };


    



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Users List'
                pageDescription='Users List'
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>User Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Email Address</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>User Type</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allUsersList != undefined && allUsersList.length > 0
                                            ?
                                            allUsersList?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.busnPartnerId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            <a href="/metronic8/demo1/apps/ecommerce/catalog/edit-product.html" className="symbol symbol-50px">
                                                                <span className="symbol-label"
                                                                    style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.profilePicturePath)})` }}
                                                                ></span>
                                                            </a>


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.firstName} {record.lastName}</a>

                                                            </div>
                                                        </div>
                                                    </td>





                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record?.emailAddress}</div>
                                                    </td>
                                                    <td role="cell">
                                                        <div className=' fw-bolder'>{record?.busnPartnerTypeName}</div>
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
                                                            onEditClick={handleUserEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.busnPartnerId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.busnPartnerId,
                                                                entityName: dBEntitiesConst.BusnPartner.tableName,
                                                                entityColumnName: dBEntitiesConst.BusnPartner.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete User'
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
                        {isLoading && <TableListLoading />}


                        {
                            isOpenAddNewForm == true
                                ?

                                <AdminUserAddForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    allCountries = {allCountries}
                                    defaultValues={userEditForm}
                                    onSubmit={handleUserFormSubmit}
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
