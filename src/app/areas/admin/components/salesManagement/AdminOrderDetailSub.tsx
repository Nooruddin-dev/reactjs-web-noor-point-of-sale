import React, { useEffect, useState } from 'react'
import { Content } from '../../../../../_poscommon/admin/layout/components/content';

import OrderDetailSection from '../../../common/components/sale/OrderDetailSection';
import AdminPageHeader from '../layout/AdminPageHeader';





export default function AdminOrderDetailSub() {
    


    return (
        <>
            <AdminPageHeader
                title='Orders Detail'
                pageDescription='Orders Detail'
                addNewClickType={'link'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <Content>


                <OrderDetailSection />

            </Content>
        </>
    )
}
