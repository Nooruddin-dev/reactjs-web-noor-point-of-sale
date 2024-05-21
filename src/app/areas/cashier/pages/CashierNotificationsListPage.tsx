import React from 'react'
import CashierLayout from '../components/CashierLayout'
import CashierPageHeader from '../components/layout/CashierPageHeader'
import CommonSiteNotificationsList from '../../common/components/CommonSiteNotificationsList'


export default function CashierNotificationsListPage() {
    return (
        <CashierLayout>
             <CashierPageHeader
                title='Notifications'
                pageDescription='Notifications'
                addNewClickType={'link'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />


            <CommonSiteNotificationsList/>


        </CashierLayout>
    )
}
