
/* eslint-disable */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"; // Example icon

import CashierLayout from "../components/CashierLayout"
import { Content } from "../../../../_poscommon/admin/layout/components/content";
import CashierPageHeader from "../components/layout/CashierPageHeader";
import { KTIcon, toAbsoluteUrl } from "../../../../_poscommon/admin/helpers";
import { CashierPosSearchBar } from "../components/layout/CashierPosSearchBar";
import CashierProductBox from "../components/pos/CashierProductBox";
import PosCategoriesBox from "../components/pos/PosCategoriesBox";
import { useEffect, useState } from "react";
import { stringIsNullOrWhiteSpace } from "../../../../_poscommon/common/helpers/global/ValidationHelper";
import { getPointOfSaleAllProductsApi, getPointOfSaleCategoriesApi } from "../../../../_poscommon/common/helpers/api_helpers/ApiCalls";
import PosCart from "../components/pos/PosCart";
import CommonListPagination from "../../common/components/CommonListPagination";
import CashierProductsAreaSimpleView from "../components/pos/CashierProductsAreaSimpleView";
import { DEFAULT_APP_SETTINGS } from "../../../../_poscommon/common/constants/Config";





const CashierPointOfSalePage = () => {
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const productsViewType: any = DEFAULT_APP_SETTINGS.POS_PRODUCT_VIEW_TYPE;  //--Detail and Simple
    const [allProducts, setAllProducts] = useState<any>(0);
    const [allCategories, setAllCategories] = useState<any>(null);
    const [diningOption, setDiningOption] = useState<any>(1);
    const [searchForm, setSearchForm] = useState<any>({
        categoryId: 0,
        manufacturerId: 0,
        productName: '',
        orderByColumnName: ''
    });


    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: 20,
            totalRecords: 0
        }
    );

    const handleSearch = () => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };

    const handleSearchCriteriaChange = (key: string, value: string) => {
        setSearchForm((prevState: any) => ({
            ...prevState,
            [key]: value
        }));
    };

    // Function to handle category clicks
    const handleCategoryClick = (categoryId: string) => {
        setSearchForm((prevState: { categoryId: string; }) => {
            if (prevState.categoryId === categoryId) {
                // If the same category is clicked, clear the category
                return { ...prevState, categoryId: '' };
            } else {
                // Otherwise, set the new category
                return { ...prevState, categoryId: categoryId };
            }
        });

        setTimeout(() => {
            handleSearch();
        }, 200)

    };


    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };


    useEffect(() => {
        getPointOfSaleAllProductsService();
    }, [listRefreshCounter]);

    const getPointOfSaleAllProductsService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (searchForm != null) {
            const searchFormQueryForm = new URLSearchParams(searchForm).toString();
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryForm}`;
        }


        getPointOfSaleAllProductsApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllProducts(res?.data);

                } else {
                    const totalRecords = 0;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllProducts([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    useEffect(() => {
        getPointOfSaleCategoriesService();
    }, []);

    const getPointOfSaleCategoriesService = () => {

        const pageBasicInfoCategory: any = {
            pageNo: 1,
            pageSize: 100
        }
        const pageBasicInfoCategoryParams = new URLSearchParams(pageBasicInfoCategory).toString();
        getPointOfSaleCategoriesApi(pageBasicInfoCategoryParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setAllCategories(res?.data);
                }
            })
            .catch((err: any) => console.log(err, "err"));
    };

    return (
        <>
            <CashierLayout>
                {/* <CashierPageHeader
                    title='Point of Sale'
                    pageDescription='Point of Sale'
                    addNewClickType={'link'}
                    newLink={'/admin/create-product'}
                    onAddNewClick={undefined}
                    additionalInfo={{
                        showAddNewButton: false
                    }
                    }
                /> */}

                <Content>
                    <CashierPosSearchBar
                        pageTitle={'POS'}
                        allCategories={allCategories}
                        searchForm={searchForm}
                        onChange={handleSearchCriteriaChange}
                        onSearch={handleSearch}
                    />


                    {/* begin::Row */}
                    <div className='row gy-5 g-xl-8 mt-3'>
                        {/* <div className='col-xl-2'>
                                <CashierListsWidget2 className='card-xl-stretch mb-xl-8' />
                            </div> */}
                        <div className='col-xl-8'>

                            {
                                productsViewType == 'Simple'
                                    ?
                                    <>
                                        <div className="card card-xl-stretch mb-5 mb-xl-8">
                                            <div className='card-header border-0'>
                                                <h3 className='card-title fw-bold text-gray-900'>Products</h3>
                                                <div className='card-toolbar'>
                                                    {/* begin::Menu */}
                                                    <button
                                                        type='button'
                                                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                                        data-kt-menu-trigger='click'
                                                        data-kt-menu-placement='bottom-end'
                                                        data-kt-menu-flip='top-end'
                                                    >
                                                        <KTIcon iconName='category' className='fs-2' />
                                                    </button>

                                                </div>
                                            </div>

                                            <div className='card-body pt-0'>
                                                <CashierProductsAreaSimpleView
                                                    allProducts={allProducts}
                                                />


                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <CommonListPagination
                                                            pageNo={pageBasicInfo.pageNo}
                                                            pageSize={pageBasicInfo.pageSize}
                                                            totalRecords={pageBasicInfo.totalRecords}
                                                            goToPage={handleGoToPage}
                                                        />
                                                    </div>
                                                </div>



                                            </div>

                                        </div>








                                    </>
                                    :
                                    <div className='card card-xl-stretch mb-5 mb-xl-8'>

                                        <div className='card-header border-0'>
                                            <h3 className='card-title fw-bold text-gray-900'>Categories</h3>
                                            <div className='card-toolbar'>
                                                {/* begin::Menu */}
                                                <button
                                                    type='button'
                                                    className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                                    data-kt-menu-trigger='click'
                                                    data-kt-menu-placement='bottom-end'
                                                    data-kt-menu-flip='top-end'
                                                >
                                                    <KTIcon iconName='category' className='fs-2' />
                                                </button>

                                            </div>
                                        </div>

                                        <div className='card-body pt-0'>


                                            <div className="pos-categories-area">

                                                <PosCategoriesBox
                                                    allCategories={allCategories}
                                                    activeCategoryId={searchForm.categoryId}
                                                    handleCategoryClick={handleCategoryClick}
                                                />


                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-11 mb-5">
                                                <h3 className='card-title fw-bold text-gray-900'>Products</h3>
                                                <div className='card-toolbar'>
                                                    {/* begin::Menu */}
                                                    <button
                                                        type='button'
                                                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                                        data-kt-menu-trigger='click'
                                                        data-kt-menu-placement='bottom-end'
                                                        data-kt-menu-flip='top-end'
                                                    >
                                                        <KTIcon iconName='category' className='fs-2' />
                                                    </button>

                                                </div>
                                            </div>

                                            <div className="row">
                                                {

                                                    allProducts != undefined && allProducts.length > 0
                                                        ?
                                                        allProducts?.map((record: any) => (
                                                            <div className="col-lg-4 mb-6">
                                                                <CashierProductBox
                                                                    productItem={record}

                                                                />

                                                            </div>
                                                        ))
                                                        :
                                                        <><h3>No product found</h3></>

                                                }

                                            </div>

                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <CommonListPagination
                                                        pageNo={pageBasicInfo.pageNo}
                                                        pageSize={pageBasicInfo.pageSize}
                                                        totalRecords={pageBasicInfo.totalRecords}
                                                        goToPage={handleGoToPage}
                                                    />
                                                </div>
                                            </div>

                                        </div>


                                    </div>

                            }




                        </div>
                        <div className='col-xl-4'>

                            <PosCart
                                diningOption={diningOption}
                            />

                        </div>
                    </div>
                    {/* end::Row */}
                </Content>
            </CashierLayout >


        </>
    )
}

export { CashierPointOfSalePage }