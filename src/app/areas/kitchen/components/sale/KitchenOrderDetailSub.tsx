import React, { useEffect, useState } from 'react'
import { Content } from '../../../../../_poscommon/admin/layout/components/content';
import KitchenPageHeader from '../layout/KitchenPageHeader';
import OrderDetailSection from '../../../common/components/sale/OrderDetailSection';






export default function KitchenOrderDetailSub() {
 
    return (
        <>
            <KitchenPageHeader
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
               <OrderDetailSection/>

            </Content>
        </>
    )
}
