import React, { useEffect, useState } from 'react'



import KitchenMainLayout from '../components/layout/KitchenMainLayout'
import KitchenOrderPageSub from '../components/sale/KitchenOrderPageSub'

export default function KitchenOrdersPage() {


    return (
        <>
            <KitchenMainLayout>
                <KitchenOrderPageSub 
                 customerId = {0}
                />
            </KitchenMainLayout>


        </>
    )
}
