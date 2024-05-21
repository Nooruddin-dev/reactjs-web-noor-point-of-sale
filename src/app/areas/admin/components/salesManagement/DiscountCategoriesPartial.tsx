import React, { useEffect, useState } from 'react'
import CommonListPagination from '../../../common/components/CommonListPagination';
import { CommonTableActionCell } from '../../../common/components/CommonTableActionCell';
import { Content } from '../../../../../_poscommon/admin/layout/components/content';
import { KTCard, KTCardBody, KTIcon } from '../../../../../_poscommon/admin/helpers';
import CommonListSearchHeader from '../../../common/components/CommonListSearchHeader';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { buildUrlParamsForSearch } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig';
import { APP_BASIC_CONSTANTS } from '../../../../../_poscommon/common/constants/Config';
import dBEntitiesConst from '../../../../../_poscommon/common/constants/dBEntitiesConst';
import { sqlDeleteTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPaperPlane, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import { getDiscountsMappedCategoriesApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import ProductsListForDiscountModal from './ProductsListForDiscountModal';
import CategoreisListForDiscountModal from './CategoreisListForDiscountModal';

export default function DiscountCategoriesPartial(props: { discountId: any, currentSelectedDiscountTypeId: number, selectedCategoriesForDiscountToAdd: any, setSelectedCategoriesForDiscountToAdd: any }) {
    const { discountId, currentSelectedDiscountTypeId, selectedCategoriesForDiscountToAdd, setSelectedCategoriesForDiscountToAdd } = props;

    // ✅-- Starts: necessary varaibles for the page
    const [isOpenAddCategoriesModal, setIsOpenAddCategoriesModal] = useState<boolean>(false);
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            discountId: discountId,
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );

    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const [discountAllCategoriesMappingList, setDiscountAllCategoriesMappingList] = useState<any>([]);

    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'CategoryIdSearch', inputName: 'CategoryIdSearch', labelName: 'Category ID', placeHolder: 'Category ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'CategoryNameSearch', inputName: 'CategoryNameSearch', labelName: 'Category Name', placeHolder: 'Category Name', type: 'search', defaultValue: '', iconClass: 'fa fa-search' },

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
            setListRefreshCounter((prevCounter: number) => prevCounter + 1);
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
        setListRefreshCounter((prevCounter: number) => prevCounter + 1);
    }



    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter((prevCounter: number) => prevCounter + 1);
    }


    const handleOpenCloseAddCategoriesModal = () => {
        setIsOpenAddCategoriesModal(!isOpenAddCategoriesModal);

    }


    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter((prevCounter: number) => prevCounter + 1);
    };

    const onAddSelectedCategoryItems = (selectedItems: any) => {
        // Log selected items to the console
        console.log('Selected items:', selectedItems);

        if (selectedItems) {

            selectedItems.forEach((record: any) => {
                const itemExistsInNewAddedCategories = selectedCategoriesForDiscountToAdd.some((item: any) => item.categoryId === record.categoryId);
                const itemExistsInOldAssociatedCategories = discountAllCategoriesMappingList.some((item: any) => item.categoryId === record.categoryId);
                if (!itemExistsInNewAddedCategories && !itemExistsInOldAssociatedCategories) {
                    // If the item doesn't exist, add it to the state
                    setSelectedCategoriesForDiscountToAdd((prevItems: any) => [...prevItems, record]);
                } else {
                    console.warn(`Category with id ${record.categoryId} already exists.`);
                }
            });

        }


        setIsOpenAddCategoriesModal(!isOpenAddCategoriesModal);
    };

    const removeCategoryFromCategoriesForDiscountToAdd = (event: any, categoryId: number) => {
        event.preventDefault();
        const confirmDeletion = window.confirm(
            `Are you sure you want to remove the item with Category ID: ${categoryId}?`
        );
        if (confirmDeletion) {
            setSelectedCategoriesForDiscountToAdd((prevItems: any) => prevItems.filter((item: any) => item.categoryId != categoryId));
        }


    }


    useEffect(() => {

        getCategoriesListForDiscountService();

    }, [currentSelectedDiscountTypeId, listRefreshCounter]);

    const getCategoriesListForDiscountService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getDiscountsMappedCategoriesApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setDiscountAllCategoriesMappingList(res?.data);
                } else {
                    setDiscountAllCategoriesMappingList([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };




    return (
        <>

            <Content>
                <div className='row mb-2'>
                    <div className="col-lg-12">
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                            <a className="btn btn-sm fw-bold  btn-danger" onClick={handleOpenCloseAddCategoriesModal}>
                                <FontAwesomeIcon icon={faPaperPlane} className='me-2' />
                                Add New Categories</a></div>
                    </div>
                </div>

                <KTCard>




                    <CommonListSearchHeader
                        searchFields={HtmlSearchFields}
                        onSearch={handleSearchForm}
                        onSearchReset={handleSearchFormReset}
                    />

                    {/* <UsersTable /> */}
                    <KTCardBody className='py-4'>

                        <div style={{ marginBottom: '65px' }}>
                            <div className='mb-6 mt-4'>
                                <h1 className="page-heading d-flex text-gray-900 fw-bold fs-4 my-0 justify-content-start">
                                    <FontAwesomeIcon icon={faList} className='me-2' />
                                    Existing Associated Categories
                                </h1>

                            </div>

                            <div className='table-responsive'>
                                <table
                                    id='kt_table_users'
                                    className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                >
                                    <thead>
                                        <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light'>
                                            <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Category Id</th>
                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Category Name</th>

                                            <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-gray-600 fw-bold'>

                                        {
                                            discountAllCategoriesMappingList != undefined && discountAllCategoriesMappingList.length > 0
                                                ?
                                                discountAllCategoriesMappingList?.map((record: any) => (
                                                    <tr role='row'>
                                                        <td role="cell" className="ps-3">{record.categoryId}</td>




                                                        <td>
                                                            <div className="d-flex align-items-center">


                                                                <div className="ms-5">

                                                                    <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.categoryName}</a>

                                                                </div>
                                                            </div>
                                                        </td>




                                                        <td role="cell" className='text-end min-w-100px pe-3'>
                                                            <CommonTableActionCell
                                                                onEditClick={undefined}
                                                                onDeleteClick={handleOnDeleteClick}
                                                                editId={record.discountCategoryMappingId}
                                                                showEditButton={false}
                                                                deleteData={{
                                                                    showDeleteButton: true,
                                                                    entityRowId: record.discountCategoryMappingId,
                                                                    entityName: dBEntitiesConst.DiscountCategoriesMapping.tableName,
                                                                    entityColumnName: dBEntitiesConst.DiscountCategoriesMapping.primaryKeyColumnName,
                                                                    sqlDeleteTypeId: sqlDeleteTypesConst.plainTableDelete,
                                                                    deleteModalTitle: 'Delete Discount Category'
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

                        </div>

                        <div className=''>
                            <div className='mb-6 mt-4'>
                                <h1 className="page-heading d-flex text-gray-900 fw-bold fs-4 my-0 justify-content-start">
                                    <FontAwesomeIcon icon={faList} className='me-2' />
                                    New Selected Categories
                                </h1>

                            </div>

                            <div className='table-responsive'>
                                <table
                                    id='kt_table_users'
                                    className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                >
                                    <thead>
                                        <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light'>
                                            <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Category Id</th>
                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Category Name</th>

                                            <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-gray-600 fw-bold'>

                                        {
                                            selectedCategoriesForDiscountToAdd != undefined && selectedCategoriesForDiscountToAdd.length > 0
                                                ?
                                                selectedCategoriesForDiscountToAdd?.map((record: any, index: number) => (
                                                    <tr role='row' key={index}>
                                                        <td role="cell" className="ps-3">{record.categoryId}</td>




                                                        <td>
                                                            <div className="d-flex align-items-center">


                                                                <div className="ms-5">

                                                                    <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.name}</a>

                                                                </div>
                                                            </div>
                                                        </td>




                                                        <td role="cell" className='text-end min-w-100px pe-3 d-flex justify-content-end'>
                                                            <div className='menu-item px-1'>
                                                                <a
                                                                    className='menu-link px-3'

                                                                    onClick={(e) => removeCategoryFromCategoriesForDiscountToAdd(e, record.categoryId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashCan} className='me-2' />
                                                                    Delete
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                ))
                                                :
                                                <></>

                                        }







                                    </tbody>
                                </table>
                            </div>
                        </div>





                    </KTCardBody>


                </KTCard>


                {
                    isOpenAddCategoriesModal == true
                        ?

                        <CategoreisListForDiscountModal
                            isOpen={isOpenAddCategoriesModal}
                            closeModal={handleOpenCloseAddCategoriesModal}
                            onAddSelectedCategoryItems={onAddSelectedCategoryItems}
                        />


                        :
                        <>
                        </>
                }


            </Content>
        </>
    )
}
