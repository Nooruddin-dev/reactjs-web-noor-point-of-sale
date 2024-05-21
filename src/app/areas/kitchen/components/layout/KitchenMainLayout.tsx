import React, { ReactNode, useEffect } from 'react'


import { FooterWrapper } from '../../../../../_poscommon/admin/layout/components/footer';
import { LayoutProvider } from '../../../../../_poscommon/admin/layout/core';
import {  ThemeModeProvider } from '../../../../../_poscommon/admin/partials';
import { MasterInit } from '../../../../../_poscommon/admin/layout/MasterInit';

import { ScrollTop } from '../../../../../_poscommon/admin/layout/components/scroll-top';

//-- ✅ Theme provider starts here
// Apps
import { MetronicI18nProvider } from '../../../../../_poscommon/admin/i18n/Metronici18n';
import '../../../../../_poscommon/admin/assets/sass/style.react.scss';
import '../../../../../_poscommon/admin/assets/fonticon/fonticon.css';
import '../../../../../_poscommon/admin/assets/keenicons/duotone/style.css';
import '../../../../../_poscommon/admin/assets/keenicons/outline/style.css';
import '../../../../../_poscommon/admin/assets/keenicons/solid/style.css';

/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import '../../_poscommon/admin/assets/css/style.rtl.css'
 **/
import '../../../../../_poscommon/admin/assets/sass/style.scss'
import '../../../../../_poscommon/kitchen/assets/css/kitchenGlobalStyle.css'
import { useLocation } from 'react-router';
import { reInitMenu } from '../../../../../_poscommon/admin/helpers';
import { KitchenHeaderWrapper } from '../../../../../_poscommon/kitchen/layout/components/header/KitchenHeaderWrapper';


interface KitchenMainLayoutProps {
  children: ReactNode;
}




const KitchenMainLayout: React.FC<KitchenMainLayoutProps> = ({ children }) => {
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  return (
    <>
      <LayoutProvider>
        <ThemeModeProvider>
          <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
            <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
              <KitchenHeaderWrapper />
              <div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
                {/* <Sidebar /> */}
                <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
                  <div className='d-flex flex-column flex-column-fluid'>
                    {children}
                  </div>
                  <FooterWrapper />
                </div>
              </div>
            </div>
          </div>

      
          <ScrollTop />




          <MasterInit />
        </ThemeModeProvider>
      </LayoutProvider>


    </>
  )
}

export default KitchenMainLayout;