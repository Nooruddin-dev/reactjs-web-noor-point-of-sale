import React, { useState, FC, ReactElement, useEffect } from 'react'
import VisitorLayout from '../components/layout/VisitorLayout'
import { Content } from '../../../../_poscommon/admin/layout/components/content'
import { KTIcon, toAbsoluteUrl } from '../../../../_poscommon/admin/helpers'
import clsx from 'clsx'
import { paymentMethodsConst } from '../../../../_poscommon/common/enums/GlobalEnums'
import { GetDefaultCurrencySymbol } from '../../../../_poscommon/common/helpers/global/GlobalHelper'
import { truncateSync } from 'fs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSort } from '@fortawesome/free-solid-svg-icons'


import VisitorCategoriesBox from '../components/services/VisitorCategoriesBox'
import VisitorProductsArea from '../components/services/VisitorProductsArea'
import VisitorCartArea from '../components/services/VisitorCartArea'
import VisitorServiceHeader from '../components/services/VisitorServiceHeader'
import { getPointOfSaleAllProductsApi, getPointOfSaleCategoriesApi } from '../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import CommonListPagination from '../../common/components/CommonListPagination'




export default function VisitorPosMainPage() {
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [allProducts, setAllProducts] = useState<any>(0);
    const [allCategories, setAllCategories] = useState<any>(null);
    const [diningOption, setDiningOption] = useState<any>(1);
    const [isSearchFormVisible, setIsSearchFormVisible] = useState<boolean>(false);


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

    const handleSearchReset = () => {
        setIsSearchFormVisible(false);

        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: 1 // Update only the pageNo property
        }));

        setSearchForm((prevState: any) => ({
            ...prevState,
            categoryId: 0,
            manufacturerId: 0,
            productName: '',
            orderByColumnName: ''
        }));



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

        getPointOfSaleCategoriesService();
    }, []);

    useEffect(() => {

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


        getPointOfSaleAllProductsService();
    }, [listRefreshCounter]);





    return (
        <VisitorLayout>
            <Content>
                <>

                    <div className="row">
                        <div className="col-lg-12">
                            <VisitorServiceHeader
                                diningOption={diningOption}
                                setDiningOption={setDiningOption}
                                isSearchFormVisible={isSearchFormVisible}
                                setIsSearchFormVisible={setIsSearchFormVisible}
                            />
                        </div>

                        <div className={`col-lg-12 visitor-collapsible-form ${isSearchFormVisible ? 'expanded' : 'collapsed'}`}>
                            {/* <div className="inner-content">
                                <form className="search-form">
                                    <input type="text" placeholder="Search term" className="form-control mb-2" />
                                    <button className="btn btn-primary">Search</button>
                                </form>
                            </div> */}

                            <div className={`card card-xl-stretch mb-xl-8 mt-2 `}>

                                {/* <div className='card-header border-0 py-5 justify-content-start'>
                                    <h3 className='card-title align-items-start flex-column'>
                                        <span className='fw-bolder text-gray-900 fs-3'>Search</span>
                                    </h3>
                                </div> */}





                                <div className='card-body p-0 pt-0 ms-5 me-5 mb-4 mt-4'>

                                    <form className="">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className='d-flex align-items-center position-relative my-1'>
                                                    <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                                                    <input
                                                        type='search'

                                                        data-kt-user-table-filter='search'
                                                        className='form-control form-control-solid  ps-14'
                                                        placeholder={'Search a Product'}
                                                        value={searchForm.productName}
                                                        onChange={e => handleSearchCriteriaChange('productName', e.target.value)}

                                                    />


                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className='d-flex align-items-center position-relative my-1'>

                                                    <KTIcon iconName='element-11' className='fs-1 position-absolute text-gray-500 me-1 ms-6' />
                                                    <select
                                                        className='form-select form-select-solid ps-14'
                                                        onChange={e => handleSearchCriteriaChange('categoryId', e.target.value)}
                                                    >
                                                        <option value=''>Search Category</option>

                                                        {allCategories?.map((item: any, index: any) => (
                                                            <option key={index} value={item.categoryId}>
                                                                {item.categoryName}
                                                            </option>
                                                        ))}
                                                    </select>


                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className='d-flex align-items-center position-relative my-1'>

                                                    <FontAwesomeIcon className='fs-1 position-absolute text-gray-500 me-1 ms-6' icon={faSort} />


                                                    <select
                                                        className='form-select form-select-solid ps-14'
                                                        onChange={e => handleSearchCriteriaChange('orderByColumnName', e.target.value)}

                                                    >
                                                        <option value=''>--Order By--</option>
                                                        <option value='Price DESC'>Price DESC</option>
                                                        <option value='Price ASC'>Price ASC</option>
                                                        <option value='Date DESC'>Date DESC</option>
                                                        <option value='Date ASC'>Date ASC</option>
                                                    </select>


                                                </div>
                                            </div>

                                            <div className="col-lg-3">
                                                <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>



                                                    {/* begin::Export */}
                                                    <button type='button' className='btn btn-light-primary me-3'
                                                        onClick={handleSearchReset}
                                                    >
                                                        <KTIcon iconName='exit-up' className='fs-2' />
                                                        Reset
                                                    </button>
                                                    {/* end::Export */}

                                                    {/* begin::Add user */}
                                                    <button type='button' className='btn btn-primary' onClick={handleSearch}>
                                                        <KTIcon iconName='magnifier' className='fs-2' />
                                                        Search
                                                    </button>
                                                    {/* end::Add user */}
                                                </div>
                                            </div>

                                        </div>


                                    </form>


                                </div>

                            </div>

                        </div>





                    </div>

                    <div className='row gy-5 g-xl-8'>

                        <div className='col-xl-2 col-lg-2'>
                            <VisitorCategoriesBox
                                allCategories={allCategories}
                                activeCategoryId={searchForm.categoryId}
                                handleCategoryClick={handleCategoryClick}
                            />
                        </div>


                        <div className='col-xl-6 col-lg-6'>
                            <VisitorProductsArea
                                allProducts={allProducts} 
                                pageBasicInfo={pageBasicInfo}    
                                handleGoToPage={handleGoToPage}                            
                            />


                        </div>

                     



                        <div className='col-xl-4 col-lg-4'>
                            <VisitorCartArea
                                diningOption={diningOption}
                            />

                        </div>

                    </div>

                </>
            </Content>
        </VisitorLayout>
    )
}
