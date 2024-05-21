/* eslint-disable */


import React, { useEffect, useState } from 'react'

import AdminLayout from '../../components/AdminLayout'
import AdminOrderDetailSub from '../../components/salesManagement/AdminOrderDetailSub'



export default function AdminOrderDetailPage() {

    return (

        <>
            <AdminLayout>
               <AdminOrderDetailSub/>
            </AdminLayout>
        </>
    )
}
