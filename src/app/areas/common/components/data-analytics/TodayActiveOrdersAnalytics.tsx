/* eslint-disable */

import { useEffect, useState } from "react"
import { toAbsoluteUrl } from "../../../../../_poscommon/admin/helpers"
import { getTodayActiveOrdersAnalyticsApi } from "../../../../../_poscommon/common/helpers/api_helpers/ApiCalls"

type Props = {
  className: string
  color: string
}

const TodayActiveOrdersAnalytics = ({ className, color }: Props) => {
  const [todayActiveOrdersData, setTodayActiveOrdersData] = useState<any>(null);
  const [activeOrdersPercentage, setActiveOrdersPercentage] = useState<any>(null);

  useEffect(() => {
    getTodayActiveOrdersAnalyticsService();
  }, []);

  const getTodayActiveOrdersAnalyticsService = () => {
    getTodayActiveOrdersAnalyticsApi()
      .then((res: any) => {
        
        const { data } = res;
        if (data) {
          setTodayActiveOrdersData(data);
        } else {
          setTodayActiveOrdersData(null);
        }


      })
      .catch((err: any) => console.log(err, "err"));
  };

  useEffect(() => {
    
    const percentage = (parseInt(todayActiveOrdersData?.activeOrders ?? 0) / parseInt(todayActiveOrdersData?.totalOrders ?? 0)) * 100;
    const roundedPercentage = percentage?.toFixed(2);
    setActiveOrdersPercentage(roundedPercentage)
  }, [todayActiveOrdersData]);


  return (
    <div

      className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
      style={{
        backgroundColor: color,
        backgroundImage: `url(${toAbsoluteUrl('media/patterns/vector-1.png')})`,
      }}
    >
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <span className='fs-2hx fw-bold text-white me-2 lh-1 ls-n2'>{todayActiveOrdersData?.totalOrders ?? 0}</span>

          <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>Today Orders</span>
        </div>
      </div>
      <div className='card-body d-flex align-items-end pt-0'>
        <div className='d-flex align-items-center flex-column mt-3 w-100'>
          <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
            <span>{parseInt(todayActiveOrdersData?.activeOrders ?? 0)} Active</span>
            <span>{activeOrdersPercentage ?? 0}%</span>
          </div>

          <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
            <div
              className='bg-white rounded h-8px'
              role='progressbar'
              style={{ width: `${activeOrdersPercentage ?? 0}%` }}
              aria-valuenow={50}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export { TodayActiveOrdersAnalytics }
