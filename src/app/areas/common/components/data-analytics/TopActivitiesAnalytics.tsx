/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { getSiteGeneralNotificationsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { getTimeSlotFromCreateOnDate, makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';


type Props = {
    className: string
}

const TopActivitiesAnalytics: React.FC<Props> = ({ className }) => {
    const [siteGeneralNotifications, setSiteGeneralNotifications] = useState<any>([])

    const getRandomBadgeClass = () => {

        const badgeClasses = [
            'text-warning',
            'text-success',
            'text-danger',
            'text-primary',
            'text-info',
        ];


        const randomIndex = Math.floor(Math.random() * badgeClasses.length);
        return badgeClasses[randomIndex];
    };



    useEffect(() => {
        getSiteGeneralNotificationsService();
    }, []);

    const getSiteGeneralNotificationsService = () => {

        const pageBasicInfo: any = {
            PageNo: 1,
            PageSize: 8
        }
        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();

        getSiteGeneralNotificationsApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    setSiteGeneralNotifications(data);


                } else {
                    setSiteGeneralNotifications([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <div className={`card ${className}`}>

            <div className='card-header align-items-center border-0 mt-4'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='fw-bold mb-2 text-gray-900'>Activities</span>
                    <span className='text-muted fw-semibold fs-7'>Today top events</span>
                </h3>

            </div>

            <div className='card-body pt-5'>

                <div className='timeline-label'>

                    {siteGeneralNotifications?.map((record: any, index: any) => (
                        <div className='timeline-item' key={index}>

                            <div className='timeline-label fw-bold text-gray-800 fs-6'>{getTimeSlotFromCreateOnDate(record.createdOn)}</div>

                            <div className='timeline-badge'>
                                <i className={`fa fa-genderless ${getRandomBadgeClass()} fs-1`}></i>
                            </div>
                            {
                                record.isRead == true
                                    ?

                                    <div className='fw-mormal timeline-content text-muted ps-3'>
                                        {makeAnyStringShortAppenDots(record.message, 60)}
                                    </div>
                                    :
                                    <div className='timeline-content d-flex'>
                                        <span className='fw-bold text-gray-800 ps-3'> {makeAnyStringShortAppenDots(record.message, 60)}</span>
                                    </div>
                            }

                        </div>

                    ))}





                </div>

            </div>

        </div>
    )
}

export { TopActivitiesAnalytics }
