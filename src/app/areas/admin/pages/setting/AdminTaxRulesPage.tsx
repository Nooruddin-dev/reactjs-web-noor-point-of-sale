/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Content } from '../../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../../components/layout/AdminPageHeader'
import { KTCard, KTCardBody } from '../../../../../_poscommon/admin/helpers'
import CommonListSearchHeader from '../../../common/components/CommonListSearchHeader'
import CommonListPagination from '../../../common/components/CommonListPagination'
import { CommonTableActionCell } from '../../../common/components/CommonTableActionCell'
import { HtmlSearchFieldConfig } from '../../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'
import { APP_BASIC_CONSTANTS } from '../../../../../_poscommon/common/constants/Config'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper'
import { sqlDeleteTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums'
import dBEntitiesConst from '../../../../../_poscommon/common/constants/dBEntitiesConst'
import { getAllCountriesApi,  getTaxCategoriesApi, getTaxRulesApi, insertUpdateTaxRuleApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import AdminTaxRuleAddUpdateForm from '../../components/setting/AdminTaxRuleAddUpdateForm'



export default function AdminTaxRulesPage() {

    const [allTaxCategories, setAllTaxCategories] = useState<boolean>(false);
    const [allCountries, setAllCountries] = useState<boolean>(false);

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
    const [allTaxRules, setAllTaxRules] = useState<any>([]);

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'taxRuleIdSearch', inputName: 'taxRuleIdSearch', labelName: 'Tax Rule ID', placeHolder: 'Tax Rule ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'categoryNameSearch', inputName: 'categoryNameSearch', labelName: 'Tax Category', placeHolder: 'Tax Category', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        {
            inputId: 'taxRuleTypeSearch',
            inputName: 'taxRuleTypeSearch',
            labelName: 'Tax rule Type',
            placeHolder: 'Tax rule Type',
            type: 'dropdown',
            defaultValue: '-999', //---999 for no value
            options: [
                { text: 'Select status', value: '-999' },
                { text: 'For Product', value: 'For Product' },
                { text: 'For Order', value: 'For Order' },

            ],
        },
    ];
    const [taxRuleEditForm, setTaxRuleEditForm] = useState<any>(null); // Data of the category being edited
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

    const handleTaxRuleEditClick = (e: Event, id: number) => {

        e.preventDefault();
        const recordForEdit = allTaxRules?.find((x: { taxRuleId: number }) => x.taxRuleId == id);

        setTaxRuleEditForm({
            taxRuleIdEditForm: recordForEdit?.taxRuleId,
            taxCategoryId: recordForEdit?.taxCategoryId,
            countryId: recordForEdit?.countryId,
            taxRate: recordForEdit?.taxRate,
            taxRuleType: recordForEdit?.taxRuleType,

        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setTaxRuleEditForm(null);
    }

    const insertUpdateTaxRuleService = (data: any) => {
        console.log('data taxRule: ', data); // Handle form submission here
        const { taxRuleIdEditForm, taxCategoryId, countryId, taxRate, taxRuleType } = data;
        if (stringIsNullOrWhiteSpace(taxCategoryId) || taxCategoryId < 1 || stringIsNullOrWhiteSpace(countryId) || countryId < 1
            || stringIsNullOrWhiteSpace(taxRate) || stringIsNullOrWhiteSpace(taxRuleType)) {
            showErrorMsg('Please fill all required fields');
            return;
        }


        let formData = {
            taxRuleId: stringIsNullOrWhiteSpace(taxRuleIdEditForm) ? 0 : taxRuleIdEditForm,
            taxCategoryId: taxCategoryId,
            countryId: countryId,
            taxRate: taxRate,
            taxRuleType: taxRuleType
        }


        insertUpdateTaxRuleApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenAddNewForm(false);
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

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };

    useEffect(() => {
        getTaxRulesService();
    }, [listRefreshCounter]);

    const getTaxRulesService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getTaxRulesApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllTaxRules(res?.data);

                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    useEffect(() => {
        getTaxCategoriesService();
        getAllCountriesService();
    }, []);

    const getTaxCategoriesService = () => {

        const pageBasicInfoTaxCategory: any = {
            pageNo: 1,
            pageSize: 200
        }
        let pageBasicInfoTaxCategoryParams = new URLSearchParams(pageBasicInfoTaxCategory).toString();
        

        getTaxCategoriesApi(pageBasicInfoTaxCategoryParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllTaxCategories(res?.data);

                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    const getAllCountriesService = () => {

        const pageBasicInfoCountry: any = {
            pageNo: 1,
            pageSize: 350
        }
        let pageBasicInfoCountryParams = new URLSearchParams(pageBasicInfoCountry).toString();
        

        getAllCountriesApi(pageBasicInfoCountryParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllCountries(res?.data);

                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Tax Rules'
                pageDescription='Tax Rules'
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Tax Rule Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Tax Category</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Country</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Tax Rate (%)</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Tax Rule Type</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allTaxRules != undefined && allTaxRules.length > 0
                                            ?
                                            allTaxRules?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.taxRuleId}</td>
                                                    <td role="cell" className="">{record.categoryName}</td>
                                                    <td role="cell" className="">{record.countryName}</td>
                                                    <td role="cell" className="">{record.taxRate}</td>
                                                    <td role="cell" className="">{record.taxRuleType}</td>





                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={handleTaxRuleEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.taxRuleId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.taxRuleId,
                                                                entityName: dBEntitiesConst.TaxRules.tableName,
                                                                entityColumnName: dBEntitiesConst.TaxRules.primaryKeyColumnName,
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

                        {
                            isOpenAddNewForm == true
                                ?

                                <AdminTaxRuleAddUpdateForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    defaultValues={taxRuleEditForm}
                                    allTaxCategories = {allTaxCategories}
                                    allCountries = {allCountries}
                                    onSubmit={insertUpdateTaxRuleService}
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
