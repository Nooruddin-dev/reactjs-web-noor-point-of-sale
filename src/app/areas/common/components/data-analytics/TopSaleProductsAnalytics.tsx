
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import { getTopSaleProductsAnalyticsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper'
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper'
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'

type Props = {
  className: string
}

const TopSaleProductsAnalytics: React.FC<Props> = ({ className }) => {
  const [topSaleProductsData, setTopSaleProductsData] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    getTopSaleProductsAnalyticsService();
  }, []);

  const getTopSaleProductsAnalyticsService = () => {
    getTopSaleProductsAnalyticsApi()
      .then((res: any) => {

        const { data } = res;
        if (data) {
          setTopSaleProductsData(data);

          const totalRevenue = data?.reduce((sum: any, product: any) => {
            return sum + product.totalRevenueSelectedProducts;
          }, 0);

          setTotalRevenue(totalRevenue?.toFixed(2) ?? 0);

        } else {
          setTopSaleProductsData(null);
        }


      })
      .catch((err: any) => console.log(err, "err"));
  };

  return (
    <div className={clsx('card', className)}>
      {/* begin::Header */}
      <div className='card-header align-items-center border-0 mt-3'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold text-gray-900 fs-3'>Best Selling Products</span>
          <span className='text-gray-500 mt-2 fw-bold fs-6'>More than {GetDefaultCurrencySymbol()}{totalRevenue}+ revenue</span>
        </h3>

      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-5'>
        {/*begin::Item*/}

        {topSaleProductsData?.map((record: any, index: any) => (

          <div className='d-flex mb-7' key={index}>

            <div className='symbol symbol-60px symbol-2by3 flex-shrink-0 me-4'>
              {
                !stringIsNullOrWhiteSpace(record.productDefaultImage)
                  ?
                  <img src={toAbsoluteUrlCustom(record.productDefaultImage)} className='mw-100' alt='' />
                  :
                  <img src={toAbsoluteUrl('media/stock/600x400/img-3.jpg')} className='mw-100' alt='' />
              }

            </div>

            <div className='d-flex align-items-center flex-wrap flex-grow-1 mt-n2 mt-lg-n1'>
              {/*begin::Title*/}
              <div className='d-flex flex-column flex-grow-1 my-lg-0 my-2 pe-3'>
                <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bolder'>
                  {makeAnyStringShortAppenDots(record?.productName, 27)}
                </a>
                <span className='text-gray-500 fw-bold fs-7 my-1'>{makeAnyStringShortAppenDots(record?.categoryName, 27)}</span>
                <span className='text-gray-500 fw-bold fs-7'>
                  By:
                  <a href='#' className='text-primary fw-bold'>
                    {record?.vendorFirstName ?? ''}   {record?.vendorLastName ?? ''}
                  </a>
                </span>
              </div>

              <div className='text-end py-lg-0 py-2'>
                <span className='text-gray-800 fw-boldest fs-3'>{record.totalOrders}</span>
                <span className='text-gray-500 fs-7 fw-bold d-block'>Sales</span>
              </div>

            </div>

          </div>
        ))}









      </div>

    </div>
  )
}

export { TopSaleProductsAnalytics }
