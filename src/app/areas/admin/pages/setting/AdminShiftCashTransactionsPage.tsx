/* eslint-disable */

import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Content } from '../../../../../_poscommon/admin/layout/components/content'
import AdminPageHeader from '../../components/layout/AdminPageHeader'

import ShiftCashTransactionsDataSub from '../../../common/components/setting/ShiftCashTransactionsDataSub'



export default function AdminShiftCashTransactionsPage() {
  

    return (
        <AdminLayout>

            <AdminPageHeader
                title='Shift Cash Transactions'
                pageDescription='Shift Cash Transactions'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
            }
            />

            <ShiftCashTransactionsDataSub/>


         

            
        </AdminLayout>
    )
}
