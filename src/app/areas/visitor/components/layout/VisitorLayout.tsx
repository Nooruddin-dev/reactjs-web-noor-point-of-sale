import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router";
import { reInitMenu } from "../../../../../_poscommon/admin/helpers";
import { LayoutProvider } from "../../../../../_poscommon/admin/layout/core";
import { ThemeModeProvider } from "../../../../../_poscommon/admin/partials";
import { FooterWrapper } from "../../../../../_poscommon/admin/layout/components/footer";
import { MasterInit } from "../../../../../_poscommon/admin/layout/MasterInit";
import { ScrollTop } from "../../../../../_poscommon/admin/layout/components/scroll-top";
import { SidebarVisitor } from "../../../../../_poscommon/visitor/layout/components/sidebar/SidebarVisitor";


//-- ✅ Theme provider starts here
// Apps
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
import '../../../../../_poscommon/visitor/assets/css/visitorGlobalCss.css'
import { HeaderWrapperVisitor } from "../../../../../_poscommon/visitor/layout/components/header/HeaderWrapperVisitor";
import VisitorLoadDefaultUser from "../common/VisitorLoadDefaultUser";




interface VisitorLayoutProps {
  children: ReactNode;
}




const VisitorLayout: React.FC<VisitorLayoutProps> = ({ children }) => {
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
              <HeaderWrapperVisitor />
              <div className='app-wrapper visitor-kt-app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
                <SidebarVisitor />
                <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
                  <div className='d-flex flex-column flex-column-fluid'>
                    {children}
                  </div>
                  <FooterWrapper />
                </div>
              </div>
            </div>
          </div>

          {/* begin:: Drawers */}
          {/* <ActivityDrawer /> */}
          {/* <RightToolbar />
          <DrawerMessenger /> */}
          {/* end:: Drawers */}

          {/* begin:: Modals */}
          {/* <InviteUsers />
          <UpgradePlan /> */}
          {/* end:: Modals */}
          
          <ScrollTop />

          <VisitorLoadDefaultUser />


          <MasterInit />
        </ThemeModeProvider>
      </LayoutProvider>
    </>
  )
}

export default VisitorLayout;