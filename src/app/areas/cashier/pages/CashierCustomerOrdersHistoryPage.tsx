import React, { useEffect, useState } from 'react'

import CashierLayout from '../components/CashierLayout'

import CashierOrderPageSub from '../components/sale/CashierOrderPageSub'
import { useParams } from 'react-router';
import { stringIsNullOrWhiteSpace } from '../../../../_poscommon/common/helpers/global/ValidationHelper';

export default function CashierCustomerOrdersHistoryPage() {
    const params = useParams<any>();
    const customerIdString = params.customerId ?? '0';
    const customerId = parseInt(customerIdString, 10); // Base 10

    

    return (
        <>
            <CashierLayout>
                <CashierOrderPageSub 
                  customerId = {customerId}
                />
            </CashierLayout>


        </>
    )
}
