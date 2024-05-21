
import clsx from 'clsx'
import { toAbsoluteUrl } from '../../../../../_poscommon/admin/helpers'
import { useEffect, useState } from 'react'
import { getTodayHeroProductsAnalyticsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'


type Props = {
  className: string
}

const items: Array<{
  name: string
  initials?: string
  src?: string
  state?: string
}> = [
    { name: 'Alan Warden', initials: 'A', state: 'warning' },
    { name: 'Michael Eberon', src: toAbsoluteUrl('media/avatars/300-11.jpg') },
    { name: 'Susan Redwood', initials: 'S', state: 'primary' },
    { name: 'Melody Macy', src: toAbsoluteUrl('media/avatars/300-2.jpg') },
    { name: 'Perry Matthew', initials: 'P', state: 'danger' },
    { name: 'Barry Walter', src: toAbsoluteUrl('media/avatars/300-12.jpg') },
  ]

const TodayHeroProductsAnalytics = ({ className }: Props) => {

  const [todayHeroProducts, setTodayHeroProducts] = useState<any>(null);


  useEffect(() => {
    getTodayHeroProductsAnalyticsService();
  }, []);

  const getTodayHeroProductsAnalyticsService = () => {
    getTodayHeroProductsAnalyticsApi()
      .then((res: any) => {
        
        const { data } = res;
        if (data) {
          setTodayHeroProducts(data);
        } else {
          setTodayHeroProducts(null);
        }


      })
      .catch((err: any) => console.log(err, "err"));
  };


  return (
    <div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='card-title d-flex flex-column'>
            <span className='fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2'>{todayHeroProducts?.totalProductsSelectedToday}</span>
            <span className='text-gray-500 pt-1 fw-semibold fs-6'>Products Selected Today</span>
          </div>
        </div>
      </div>
      <div className='card-body d-flex flex-column justify-content-end pe-0'>
        <span className='fs-6 fw-bolder text-gray-800 d-block mb-2'>Today’s Heroes</span>
        <div className='symbol-group symbol-hover flex-nowrap'>
          {todayHeroProducts?.todayTopCustomerSpendings?.map((record: any, index:  number) => (
            <div
              className='symbol symbol-35px symbol-circle'
              data-bs-toggle='tooltip'
              title={record.firstName}
              key={`cw7-item-${index}`}
            >
               {items[index].src && <img alt='Pic' src={items[index]?.src ?? toAbsoluteUrl('media/avatars/300-11.jpg')} />}
         
              

              {/* {items[index].state && items[index].initials && (
                <span
                  className={clsx(
                    'symbol-label fw-bold',
                    'bg-' + items[index]?.state ?? 'primary',
                    'text-inverse-' + items[index]?.state ?? 'primary'
                  )}
                >
                     {items[index]?.initials}
                </span>
              )} */}
            </div>
          ))}

          <a href='#' className='symbol symbol-35px symbol-circle'>
            <span
              className={clsx('symbol-label fs-8 fw-bold', 'bg-dark', 'text-gray-300')}
            >
              +30
            </span>
          </a>
        </div>
      </div>
    </div>

  )
}

export { TodayHeroProductsAnalytics }
