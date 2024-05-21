import React from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../../../_poscommon/admin/helpers'
import clsx from 'clsx'
import VisitorProductBox from './VisitorProductBox';
import CommonListPagination from '../../../common/components/CommonListPagination';

export default function VisitorProductsArea(props: { allProducts: any, pageBasicInfo: any, handleGoToPage: any }) {
    const { allProducts, pageBasicInfo, handleGoToPage } = props;
    return (
        <div className={clsx('card', 'card-xxl-stretch')}>

            <div className='card-header align-items-center border-0 mt-2'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='fw-bolder text-gray-900 fs-3'>Products</span>


                </h3>
                <div className='card-toolbar'>

                    <button
                        type='button'
                        className='btn btn-clean btn-sm btn-icon btn-icon-primary btn-active-light-primary me-n3'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                    >
                        <KTIcon iconName='category' className='fs-2' />
                    </button>


                </div>
            </div>

            <div className='card-body pt-3'>

                <div className="row">

                    {

                        allProducts != undefined && allProducts.length > 0
                            ?
                            allProducts?.map((record: any) => (
                                <div className="col-md-6 mb-6">
                                    <VisitorProductBox
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
                        <div className='col-xl-12 col-lg-12'>
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

        </div>
    )
}
