import React from 'react'
import AdminLayout from '../../components/AdminLayout'
import AdminPageHeader from '../../components/layout/AdminPageHeader'
import CommonSiteNotificationsList from '../../../common/components/CommonSiteNotificationsList'

export default function AdminNotificationsListPage() {
    return (
        <AdminLayout>
            <AdminPageHeader
                title='Notifications'
                pageDescription='Notifications'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <CommonSiteNotificationsList/>


        </AdminLayout>
    )
}
