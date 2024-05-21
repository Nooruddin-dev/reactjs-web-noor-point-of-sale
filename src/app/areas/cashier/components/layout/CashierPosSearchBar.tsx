import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../../../_poscommon/admin/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

const CashierPosSearchBar = (props: {
    pageTitle: any,
    allCategories: any,
    onChange: any,
    onSearch: any,
    searchForm: {
        categoryId: number;
        manufacturerId: number;
        productName: string;
        orderByColumnName: string;
    }
}) => {
    const { pageTitle, allCategories,  onChange, onSearch, searchForm } = props;

    return (
        <div
            className='card rounded-0 shadow-none border-0 bgi-no-repeat bgi-position-x-end bgi-size-cover'
            style={{
                backgroundColor: '#663259',
                backgroundSize: 'auto 100%',
                backgroundImage: `url('${toAbsoluteUrl('media/misc/taieri.svg')}')`,
            }}
        >

            <div className='card-body container-xxl pt-10 pb-8'>

                <div className=' d-flex align-items-center'>
                    <h1 className='fw-bold me-3 text-white'>{pageTitle}</h1>

                    <span className='fw-bold text-white opacity-50'>Point of Sale System</span>
                </div>



                <div className='d-flex flex-column'>

                    <div className='d-lg-flex align-lg-items-center'>

                        <div className='rounded d-flex flex-column flex-lg-row align-items-lg-center bg-body p-5 w-xxl-950px h-lg-60px me-lg-10 my-5'>

                            <div className='row flex-grow-1 mb-5 mb-lg-0'>

                                <div className='col-lg-4 d-flex align-items-center mb-3 mb-lg-0'>
                                    <KTIcon iconName='magnifier' className='fs-1 text-gray-500 me-1' />
                                  
                                    <input
                                        type='search'
                                        className='form-control form-control-flush flex-grow-1'
                                        name='search'
                                        value={searchForm.productName}
                                        onChange={e => onChange('productName', e.target.value)}
                                        placeholder='Search Product'
                                    />

                                </div>



                                <div className='col-lg-4 d-flex align-items-center mb-5 mb-lg-0'>

                                    <div className='bullet bg-secondary d-none d-lg-block h-30px w-2px me-5'></div>

                                    <KTIcon iconName='element-11' className='fs-1 text-gray-500 me-1' />

                                    <select
                                        className='form-select border-0 flex-grow-1'
                                        data-control='select2'
                                        data-placeholder='Category'
                                        data-hide-search='true'
                                        defaultValue={searchForm.categoryId}
                                        onChange={e => onChange('categoryId', e.target.value)}
                                    >
                                        <option value=''>Search Category</option>
                                      
                                        {allCategories?.map((item: any, index: any) => (
                                            <option key={index} value={item.categoryId}>
                                                {item.categoryName}
                                            </option>
                                        ))}
                                    </select>

                                </div>






                                {/* <div className='col-lg-3 d-flex align-items-center mb-5 mb-lg-0'>

                                    <div className='bullet bg-secondary d-none d-lg-block h-30px w-2px me-5'></div>

                                    <KTIcon iconName='element-11' className='fs-1 text-gray-500 me-1' />

                                    <select
                                        className='form-select border-0 flex-grow-1'
                                        data-control='select2'
                                        data-placeholder='Vendor'
                                        data-hide-search='true'
                                        defaultValue={searchForm.manufacturerId}
                                        onChange={e => onChange('manufacturerId', e.target.value)}

                                    >
                                        <option value=''>Search Vendor</option>
                                        <option value='1'>Vendor One</option>
                                        <option value='2'>Vendor Two</option>
                                        <option value='3'>Vendor Three</option>
                                    </select>

                                </div> */}

                                <div className='col-lg-4 d-flex align-items-center mb-5 mb-lg-0'>

                                    <div className='bullet bg-secondary d-none d-lg-block h-30px w-2px me-5'></div>

                                    {/* <KTIcon iconName='element-11' className='fs-1 text-gray-500 me-1' /> */}
                                    <FontAwesomeIcon className='fs-1 text-gray-500 me-1'  icon={faSort} />

                                    <select
                                        className='form-select border-0 flex-grow-1'
                                        data-control='select2'
                                        data-placeholder='Sort'
                                        data-hide-search='true'
                                        defaultValue={searchForm.orderByColumnName}
                                        onChange={e => onChange('orderByColumnName', e.target.value)}

                                    >
                                        <option value=''>--Order By--</option>
                                        <option value='Price DESC'>Price DESC</option>
                                        <option value='Price ASC'>Price ASC</option>
                                        <option value='Date DESC'>Date DESC</option>
                                        <option value='Date ASC'>Date ASC</option>
                                    </select>

                                </div>



                            </div>



                            <div className='min-w-150px text-end'>
                                <button type='button' onClick={onSearch} className='btn btn-dark' id='kt_advanced_search_button_1'>
                                    Search
                                </button>
                            </div>

                        </div>


                    </div>

                </div>

            </div>

        </div>
    )
}
export { CashierPosSearchBar }
