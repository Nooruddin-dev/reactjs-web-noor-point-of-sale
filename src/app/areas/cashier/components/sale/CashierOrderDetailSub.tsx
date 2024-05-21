import React, { useEffect, useState } from 'react'
import CashierPageHeader from '../layout/CashierPageHeader';
import { Content } from '../../../../../_poscommon/admin/layout/components/content';

import OrderDetailSection from '../../../common/components/sale/OrderDetailSection';





export default function CashierOrderDetailSub() {
    


    return (
        <>
            <CashierPageHeader
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
