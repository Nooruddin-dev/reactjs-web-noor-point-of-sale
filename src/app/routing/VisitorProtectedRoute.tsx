
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { RootState } from '../globalStore/rootReducer';
import BusinessPartnerTypesEnum from '../../_poscommon/common/enums/BusinessPartnerTypesEnum';


interface VisitorProtectedRouteProps {
    children: ReactNode; // Allows passing any React component(s)
  }

const VisitorProtectedRoute: React.FC<VisitorProtectedRouteProps> = ({ children }) => {
    const loginUser = useSelector((state: RootState) => state.userData.userData);

    if (loginUser != undefined && loginUser != null && Object.keys(loginUser).length !== 0 && loginUser.busnPartnerId > 0 && (loginUser.busnPartnerTypeId == BusinessPartnerTypesEnum.Customer && loginUser.isWalkThroughCustomer == true)) {
        return <>{children}</>;
    }

  return <Navigate to="/auth/login" />

}
export default VisitorProtectedRoute;