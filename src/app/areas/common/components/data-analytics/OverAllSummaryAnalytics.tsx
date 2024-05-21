import { FC, useEffect, useState } from 'react'
import { KTIcon } from '../../../../../_poscommon/admin/helpers'
import { getOverAllSummaryAnalyticsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'


type Props = {
    className: string
    backGroundColor: string
}

const OverAllSummaryAnalytics: FC<Props> = ({ className, backGroundColor }) => {
    const [allSummaryData, setAllSummaryData] = useState<any>(null);


    useEffect(() => {
        getOverAllSummaryAnalyticsService();
    }, []);
  
    const getOverAllSummaryAnalyticsService = () => {
        getOverAllSummaryAnalyticsApi()
        .then((res: any) => {
          
          const { data } = res;
          if (data) {
            setAllSummaryData(data);
          } else {
            setAllSummaryData(null);
          }
  
  
        })
        .catch((err: any) => console.log(err, "err"));
    };

    return (
        <div
            className={`card ${className} theme-dark-bg-body`}
            style={{ backgroundColor: backGroundColor }}
        >
            {/* begin::Body */}
            <div className='card-body d-flex flex-column'>
                {/* begin::Wrapper */}
                <div className='d-flex flex-column mb-7'>
                    {/* begin::Title  */}
                    <a href='#' className='text-gray-900 text-hover-primary fw-bolder fs-3'>
                        Summary
                    </a>
                    {/* end::Title */}
                </div>
                {/* end::Wrapper */}

                <div className='row g-0'>

                    <div className='col-6'>
                        <div className='d-flex align-items-center mb-9 me-2'>
                            {/*begin::Symbol*/}
                            <div className='symbol symbol-40px me-3'>
                                <div className='symbol-label bg-body bg-opacity-50'>
                                    <KTIcon iconName='abstract-42' className='fs-1 text-gray-900' />
                                </div>
                            </div>
                            {/*end::Symbol*/}

                            {/*begin::Title*/}
                            <div>
                                <div className='fs-5 text-gray-900 fw-bolder lh-1'> {allSummaryData?.totalProducts}</div>
                                <div className='fs-7 text-gray-600 fw-bold'>Products</div>
                            </div>
                            {/*end::Title*/}
                        </div>
                    </div>



                    <div className='col-6'>
                        <div className='d-flex align-items-center mb-9 ms-2'>
                            {/*begin::Symbol*/}
                            <div className='symbol symbol-40px me-3'>
                                <div className='symbol-label bg-body bg-opacity-50'>
                                    <KTIcon iconName='abstract-45' className='fs-1 text-gray-900' />
                                </div>
                            </div>
                            {/*end::Symbol*/}

                            {/*begin::Title*/}
                            <div>
                                <div className='fs-5 text-gray-900 fw-bolder lh-1'>{GetDefaultCurrencySymbol()}{allSummaryData?.totalRevenue}</div>
                                <div className='fs-7 text-gray-600 fw-bold'>Revenue</div>
                            </div>
                            {/*end::Title*/}
                        </div>
                    </div>



                    <div className='col-6'>
                        <div className='d-flex align-items-center mb-9 me-2'>
                            {/*begin::Symbol*/}
                            <div className='symbol symbol-40px me-3'>
                                <div className='symbol-label bg-body bg-opacity-50'>
                                    <KTIcon iconName='abstract-21' className='fs-1 text-gray-900' />
                                </div>
                            </div>
                            {/*end::Symbol*/}

                            {/*begin::Title*/}
                            <div>
                                <div className='fs-5 text-gray-900 fw-bolder lh-1'>{GetDefaultCurrencySymbol()}{allSummaryData?.currentMonthTotalSale}</div>
                                <div className='fs-7 text-gray-600 fw-bold'>April Sale</div>
                            </div>
                            {/*end::Title*/}
                        </div>
                    </div>



                    <div className='col-6'>
                        <div className='d-flex align-items-center mb-9 ms-2'>
                            {/*begin::Symbol*/}
                            <div className='symbol symbol-40px me-3'>
                                <div className='symbol-label bg-body bg-opacity-50'>
                                    <KTIcon iconName='abstract-44' className='fs-1 text-gray-900' />
                                </div>
                            </div>
                            {/*end::Symbol*/}

                            {/*begin::Title*/}
                            <div>
                                <div className='fs-5 text-gray-900 fw-bolder lh-1'>{allSummaryData?.totalOrders}</div>
                                <div className='fs-7 text-gray-600 fw-bold'>Total Orders</div>
                            </div>
                            {/*end::Title*/}
                        </div>
                    </div>

                    <div className='col-6'>
                        <div className='d-flex align-items-center mb-9 me-2'>
                            {/*begin::Symbol*/}
                            <div className='symbol symbol-40px me-3'>
                                <div className='symbol-label bg-body bg-opacity-50'>
                                    <KTIcon iconName='abstract-25' className='fs-1 text-gray-900' />
                                </div>
                            </div>
                            {/*end::Symbol*/}

                            {/*begin::Title*/}
                            <div>
                                <div className='fs-5 text-gray-900 fw-bolder lh-1'>{allSummaryData?.totalCustomers}</div>
                                <div className='fs-7 text-gray-600 fw-bold'>Total Customers</div>
                            </div>
                            {/*end::Title*/}
                        </div>
                    </div>

                    <div className='col-6'>
                        <div className='d-flex align-items-center mb-9 ms-2'>
                            {/*begin::Symbol*/}
                            <div className='symbol symbol-40px me-3'>
                                <div className='symbol-label bg-body bg-opacity-50'>
                                    <KTIcon iconName='abstract-21' className='fs-1 text-gray-900' />
                                </div>
                            </div>
                            {/*end::Symbol*/}

                            {/*begin::Title*/}
                            <div>
                                <div className='fs-5 text-gray-900 fw-bolder lh-1'>{allSummaryData?.todayTotalOrders ?? 0}</div>
                                <div className='fs-7 text-gray-600 fw-bold'>Today Orders</div>
                            </div>
                            {/*end::Title*/}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export { OverAllSummaryAnalytics }
