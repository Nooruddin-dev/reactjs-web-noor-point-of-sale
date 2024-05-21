import { Link } from "react-router-dom";
import { MenuInnerWithSub } from "../../../../../admin/layout/components/header/header-menus/MenuInnerWithSub";
import { MenuItem } from "../../../../../admin/layout/components/header/header-menus/MenuItem";
import { toAbsoluteUrl } from "../../../../../admin/helpers";
import useIsMobile from "../../../../../common/hooks/useIsMobile";



export function CashierMenuInner() {
  const isMobile = useIsMobile();
  //const intl = useIntl()
  return (
    <>
      {
        isMobile == false
          ?
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0' style={{ marginRight: '1.25rem' }}>
            <Link to='/cashier/dashboard' className=''>
              <img
                alt='Logo'
                src={toAbsoluteUrl('media/logos/default-small.png')}
                className='h-40px'
              />
            </Link>
          </div>
          :
          <></>
      }


      <MenuItem title={'Dashboard'} to='/cashier/dashboard' />
      <MenuItem title='Point of Sale' to='/cashier/point-of-sale' />

      <MenuInnerWithSub
        title='Sales'
        to='/cashier/sales'
        menuPlacement='bottom-start'
        menuTrigger={`{default:'click', lg: 'hover'}`}
      >
        <MenuItem icon='abstract-26' to='/cashier/orders-list' title='Orders' />
        {/* <MenuItem icon='abstract-28' to='/pos/products-list' title='Products List' /> */}
        {/* <MenuItem icon='abstract-25' to='/pos/orders' title='Refunds & Returns' /> */}
        {/* <MenuItem icon='abstract-22' to='/pos/products-list' title='Receipt Printing' /> */}
        <MenuItem icon='abstract-19' to='/pos/products-list' title='Sales Reports' />

        
      </MenuInnerWithSub>

      <MenuInnerWithSub title='Users Management' to='/apps' menuPlacement='bottom-start'
        menuTrigger={`{default:'click', lg: 'hover'}`}
      >
        <MenuItem icon='abstract-28' to='/cashier/customers-list' title='Customers List' />
        <MenuItem icon='abstract-24' to='/cashier/shift-management' title='Shift Management' />
        <MenuItem icon='abstract-25' to='/cashier/shift-cash-transactions' title='Shift Cash Transactions' />
        {/* <MenuItem icon='abstract-23' to='/cashier/customers-list' title='Check In/Out' /> */}

      </MenuInnerWithSub>

     
    </>
  )
}


