import clsx from 'clsx'


import { useLayout } from '../../../../admin/layout/core'
import { KTIcon, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../admin/helpers'
import { HeaderNotificationsMenu, HeaderUserMenu, ThemeModeSwitcher } from '../../../../admin/partials'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../app/globalStore/rootReducer'
import { stringIsNullOrWhiteSpace } from '../../../../common/helpers/global/ValidationHelper'


const itemClass = 'ms-1 ms-md-4'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px'
const userAvatarClass = 'symbol-35px'
const btnIconClass = 'fs-2'

const CashierNavbar = () => {
  const loginUser = useSelector((state: RootState) => state.userData.userData);
  const profilePictureUrl = loginUser?.profilePictureUrl;



  const { config } = useLayout()
  return (
    <div className='app-navbar flex-shrink-0'>


      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div id='kt_activities_toggle' className={btnClass}>
          <KTIcon iconName='chart-simple' className={btnIconClass} />
        </div>
      </div> */}

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          className={btnClass}
        >
          <KTIcon iconName='message-text-2' className={btnIconClass} />
          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
        </div>
        <HeaderNotificationsMenu />
      </div> */}

      <div className={clsx('app-navbar-item', itemClass)}>
        <div 
            data-kt-menu-trigger="{default:'click', lg: 'hover'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          className={`${btnClass} position-relative`}
        >
          <KTIcon iconName='message-text-2' className={btnIconClass} />
          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
        </div>
        <HeaderNotificationsMenu />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          // data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-trigger="{default:'click', lg: 'hover'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          {
            profilePictureUrl && !stringIsNullOrWhiteSpace(profilePictureUrl)
              ?
              <img src={toAbsoluteUrlCustom(profilePictureUrl)} alt='' />
              :
              <img src={toAbsoluteUrl('media/avatars/300-3.jpg')} alt='' />
          }

        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export { CashierNavbar }
