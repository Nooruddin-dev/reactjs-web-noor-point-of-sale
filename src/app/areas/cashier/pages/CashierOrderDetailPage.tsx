/* eslint-disable */


import React, { useEffect, useState } from 'react'
import CashierLayout from '../components/CashierLayout'

import CashierOrderDetailSub from '../components/sale/CashierOrderDetailSub'



export default function CashierOrderDetailPage() {

    return (

        <>
            <CashierLayout>
               <CashierOrderDetailSub/>
            </CashierLayout>
        </>
    )
}
