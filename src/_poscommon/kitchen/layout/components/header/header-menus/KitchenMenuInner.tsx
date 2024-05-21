import { Link } from "react-router-dom";
import { MenuInnerWithSub } from "../../../../../admin/layout/components/header/header-menus/MenuInnerWithSub";
import { MenuItem } from "../../../../../admin/layout/components/header/header-menus/MenuItem";
import { toAbsoluteUrl } from "../../../../../admin/helpers";
import useIsMobile from "../../../../../common/hooks/useIsMobile";



export function KitchenMenuInner() {
  const isMobile = useIsMobile();
  //const intl = useIntl()
  return (
    <>
      {
        isMobile == false
          ?
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0' style={{ marginRight: '1.25rem' }}>
            <Link to='/dashboard' className=''>
              <img
                alt='Logo'
                src={toAbsoluteUrl('media/logos/default-small.png')}
                className='h-30px'
              />
            </Link>
          </div>
          :
          <></>
      }


      <MenuItem title={'Dashboard'} to='/kitchen/dashboard' />
      <MenuItem title='Orders' to='/kitchen/orders-list' />



    

     
    </>
  )
}


