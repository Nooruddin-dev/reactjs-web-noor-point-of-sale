import React, { ReactNode } from 'react'
import { LayoutProvider } from '../../../../_poscommon/admin/layout/core';
import { ThemeModeProvider } from '../../../../_poscommon/admin/partials';
import { MasterInit } from '../../../../_poscommon/admin/layout/MasterInit';

//-- ✅ Theme provider starts here
// Apps
import { MetronicI18nProvider } from '../../../../_poscommon/admin/i18n/Metronici18n';
import '../../../../_poscommon/admin/assets/sass/style.react.scss';
import '../../../../_poscommon/admin/assets/fonticon/fonticon.css';
import '../../../../_poscommon/admin/assets/keenicons/duotone/style.css';
import '../../../../_poscommon/admin/assets/keenicons/outline/style.css';
import '../../../../_poscommon/admin/assets/keenicons/solid/style.css';

/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import '../../_poscommon/admin/assets/css/style.rtl.css'
 **/
import '../../../../_poscommon/admin/assets/sass/style.scss'
import '../../../../_poscommon/admin/assets/css/adminGlobalCss.css'



interface LoginLayoutProps {
  children: ReactNode;
}




const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <>
      <LayoutProvider>
        <ThemeModeProvider>
          {children}
          <MasterInit />
        </ThemeModeProvider>
      </LayoutProvider>


    </>
  )
}

export default LoginLayout;