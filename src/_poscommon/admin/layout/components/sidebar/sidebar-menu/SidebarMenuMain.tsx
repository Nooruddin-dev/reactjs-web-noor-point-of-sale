
import { KTIcon } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {


  return (
    <>
      <SidebarMenuItem
        to='/admin/dashboard'
        icon='element-11'
        title={'Dashboard'}
        fontIcon='bi-app-indicator'
      />

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Product Catalog</span>
        </div>
      </div>


      <SidebarMenuItemWithSub
        to=''
        title='Products'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItem to='/admin/products' title='Products List' hasBullet={true} />
        <SidebarMenuItem to='/admin/create-product' title='Create Product' hasBullet={true} />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/admin/products-tags'
        title='Basic Data'
        icon='data'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/admin/products-categories' title='Categories' hasBullet={true} />
        <SidebarMenuItem to='/admin/products-tags' title='Tags' hasBullet={true} />
        <SidebarMenuItem to='/admin/manufacturers' title='Manufacturers' hasBullet={true} />


      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/admin/inventory/items'
        title='Inventory Management'
        icon='element-8'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/admin/inventory/items' title='Inventory Items' hasBullet={true} />
        <SidebarMenuItem to='/admin/inventory/warehouses' title='Warehouses' hasBullet={true} />
        <SidebarMenuItem to='/admin/inventory/inventory-methods' title='Inventory Methods' hasBullet={true} />

      </SidebarMenuItemWithSub>


      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Users Management</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/admin/users/users-list'
        icon='user'
        title='Users'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/admin/users/users-list' title='Users List' hasBullet={true} />
        <SidebarMenuItem to='/admin/users/users-types' title='Users Types' hasBullet={true} />
        {/* <SidebarMenuItem to='/apps/chat/drawer-chat' title='User Address Types' hasBullet={true} /> */}
      </SidebarMenuItemWithSub>
      {/* <SidebarMenuItem
        to='/apps/user-management/users'
        icon='entrance-left'
        title='Roles Permission'
        fontIcon='bi-layers'
      /> */}


      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Sales Management</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/apps/user-management/users'
        icon='handcart'
        title='Orders'
        fontIcon='bi-layers'
      >
        {/* <SidebarMenuItem to='/cashier/orders-list' title='Customer Orders' hasBullet={true} /> */}
        <SidebarMenuItem to='/admin/sales/order-statuses' title='Order Status' hasBullet={true} />
        <SidebarMenuItem to='/admin/sales/sales-orders' title='Sales Orders' hasBullet={true} />
      </SidebarMenuItemWithSub>


      <SidebarMenuItem
        to='/admin/sale/payment-methods'
        icon='credit-cart'
        title='Payment Methods'
        fontIcon='bi-layers'
      />

      <SidebarMenuItem
        to='/admin/discounts'
        icon='abstract-28'
        title='Discounts'
        fontIcon='bi-layers'
      />

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Setting</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/apps/user-management/users'
        icon='abstract-45'
        title='Taxes'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/admin/setting/tax-categories' title='Tax Categories' hasBullet={true} />
        <SidebarMenuItem to='/admin/setting/tax-rules' title='Tax Rules' hasBullet={true} />

      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/apps/user-management/users'
        icon='abstract-45'
        title='Shifts'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/admin/setting/shift-names' title='Shift Name' hasBullet={true} />
        <SidebarMenuItem to='/admin/setting/shift-cash-transaction-types' title='Cash Transaction Types' hasBullet={true} />
        <SidebarMenuItem to='/admin/setting/shift-cash-drawer-reconciliation-statuses' title='Cash Drawer Reconciliation Statuses' hasBullet={true} />
        <SidebarMenuItem to='/admin/setting/shift-cash-transactions-data' title='Shift Cash Transactions' hasBullet={true} />

      </SidebarMenuItemWithSub>



    </>
  )
}

export { SidebarMenuMain }
