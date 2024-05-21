
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { RootState } from '../globalStore/rootReducer';
import BusinessPartnerTypesEnum from '../../_poscommon/common/enums/BusinessPartnerTypesEnum';


interface CashierProtectedRouteProps {
    children: ReactNode; // Allows passing any React component(s)
  }

const CashierProtectedRoute: React.FC<CashierProtectedRouteProps> = ({ children }) => {
    const loginUser = useSelector((state: RootState) => state.userData.userData);

    if (loginUser != undefined && loginUser != null && Object.keys(loginUser).length !== 0 && loginUser.busnPartnerId > 0 && loginUser.busnPartnerTypeId == BusinessPartnerTypesEnum.Cashier) {
        return <>{children}</>;
    }

  return <Navigate to="/auth/login" />

}
export default CashierProtectedRoute;