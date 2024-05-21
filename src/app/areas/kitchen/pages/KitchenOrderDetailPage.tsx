/* eslint-disable */


import React, { useEffect, useState } from 'react'



import KitchenMainLayout from '../components/layout/KitchenMainLayout'
import KitchenOrderDetailSub from '../components/sale/KitchenOrderDetailSub'



export default function KitchenOrderDetailPage() {

    return (

        <>
            <KitchenMainLayout>
               <KitchenOrderDetailSub/>
            </KitchenMainLayout>
        </>
    )
}
