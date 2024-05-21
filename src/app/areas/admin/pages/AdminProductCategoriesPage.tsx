/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../components/layout/AdminPageHeader'
import { KTCard, KTCardBody, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../common/components/CommonListSearchHeader'
import TableListLoading from '../../common/components/TableListLoading'
import CommonListPagination from '../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import CategoryAddForm from '../components/productsCataglog/CategoryAddForm'
import { buildUrlParamsForSearch } from '../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../_poscommon/common/constants/Config'
import { getProductCategoriesApi, insertUpdateProductCategoryApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper'
import { dataOperationTypeConst, sqlDeleteTypesConst } from '../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../_poscommon/common/constants/dBEntitiesConst'


export default function AdminProductCategoriesPage() {
    const isLoading = false;

    // ✅-- Starts: necessary varaibles for the page
    const [categoryIDEdit, setCategoryIDEdit] = useState<number>(0);
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
    const [productAllCategories, setProductAllCategories] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'categoryIdSearch', inputName: 'categoryIdSearch', labelName: 'Category ID', placeHolder: 'Category ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'categoryNameSearch', inputName: 'categoryNameSearch', labelName: 'Category Name', placeHolder: 'Category Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

    ];
    const [categoryEditForm, setCategoryEditForm] = useState<any>(null); // Data of the category being edited
    // ✅-- Ends: necessary varaibles for the page

    const [parentCategoriesDropdown, setParentCategoriesDropdown] = useState<any>([]);

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

    const handleCategoryEditClick = (e: Event, id: number) => {
        e.preventDefault();
        const recordForEdit = productAllCategories?.find((x: { categoryId: number }) => x.categoryId == id);
        setCategoryIDEdit(recordForEdit?.categoryId);

        setCategoryEditForm({
            catgIdEditForm: recordForEdit?.categoryId,
            name: recordForEdit?.name,
            parentCategoryID: recordForEdit?.parentCategoryID,
            isActive: recordForEdit?.isActive == true ? '1' : '0',
            attachmentID: recordForEdit?.attachmentID,
        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setCategoryIDEdit(0);
        setCategoryEditForm(null);
    }

    const handleCategoryFormSubmit = (data: any) => {
        console.log('data category: ', data); // Handle form submission here
        const { catgIdEditForm, attachmentID, name, parentCategoryID, isActive } = data;
        if (stringIsNullOrWhiteSpace(name) || stringIsNullOrWhiteSpace(isActive)) {
            showErrorMsg('Please fill all required fields');
            return;
        }

        // const formData = {
        //     name: name,
        //     parentCategoryID: parentCategoryID,
        //     isActive: isActive?.toString() == "1" ? true : false,
        //     dataOperationType: categoryIDEdit > 0 ? dataOperationTypeConst.Update : dataOperationTypeConst.Insert
        // };



        const formData = new FormData();
        formData.append('CategoryID', catgIdEditForm);
        formData.append('Name', name);
        formData.append('ParentCategoryID', parentCategoryID ?? '0');
        formData.append('IsActive', isActive?.toString() == "1" ? 'true' : 'false');
        formData.append('CategoryImage', data.categoryImage[0]); // Assuming categoryImage is a FileList
        formData.append('AttachmentId', attachmentID ?? 0);


        insertUpdateProductCategoryApi(formData)
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
        getProductCategoriesService();
    }, [listRefreshCounter]);

    const getProductCategoriesService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getProductCategoriesApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                }
                setProductAllCategories(res?.data);

            })
            .catch((err: any) => console.log(err, "err"));
    };

    useEffect(() => {
        getParentCategoryDropDownService();
    }, []);

    const getParentCategoryDropDownService = () => {
        let pageBody: any = {
            PageNo: 1,
            PageSize: 1000
        }
        let paramsParentCategory = new URLSearchParams(pageBody).toString();
        getProductCategoriesApi(paramsParentCategory)
            .then((res: any) => {

                setParentCategoriesDropdown(res?.data);

            })
            .catch((err: any) => console.log(err, "err"));
    };




    return (
        <AdminLayout>
            <AdminPageHeader
                title='Product Categories'
                pageDescription='Product Categories'
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Category Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Category Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Parent Category</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        productAllCategories != undefined && productAllCategories.length > 0
                                            ?
                                            productAllCategories?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.categoryId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            <a href="/metronic8/demo1/apps/ecommerce/catalog/edit-product.html" className="symbol symbol-50px">
                                                                <span className="symbol-label"
                                                                    style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.categoryImagePath)})` }}
                                                                ></span>
                                                            </a>


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.name}</a>

                                                            </div>
                                                        </div>
                                                    </td>





                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record?.parentCategoryName}</div>
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
                                                            onEditClick={handleCategoryEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.categoryId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.categoryId,
                                                                entityName: dBEntitiesConst.ProductCategories.tableName,
                                                                entityColumnName: dBEntitiesConst.ProductCategories.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.plainTableDelete,
                                                                deleteModalTitle: 'Delete Category'
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

                                <CategoryAddForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    parentCategoriesDropdown={parentCategoriesDropdown}
                                    defaultValues={categoryEditForm}
                                    onSubmit={handleCategoryFormSubmit}
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
