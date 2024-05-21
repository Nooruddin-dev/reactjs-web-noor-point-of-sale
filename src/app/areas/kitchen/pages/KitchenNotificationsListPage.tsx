import React from 'react'
import CommonSiteNotificationsList from '../../common/components/CommonSiteNotificationsList'
import KitchenMainLayout from '../components/layout/KitchenMainLayout'
import KitchenPageHeader from '../components/layout/KitchenPageHeader'


export default function KitchenNotificationsListPage() {
    return (
        <KitchenMainLayout>


            <KitchenPageHeader
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


            <CommonSiteNotificationsList />


        </KitchenMainLayout>
    )
}
