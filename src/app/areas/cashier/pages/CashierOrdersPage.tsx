import React, { useEffect, useState } from 'react'

import CashierLayout from '../components/CashierLayout'

import CashierOrderPageSub from '../components/sale/CashierOrderPageSub'

export default function CashierOrdersPage() {


    return (
        <>
            <CashierLayout>
                <CashierOrderPageSub 
                 customerId = {0}
                />
            </CashierLayout>


        </>
    )
}
