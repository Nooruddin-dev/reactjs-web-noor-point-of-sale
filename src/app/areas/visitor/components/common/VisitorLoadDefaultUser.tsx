/* eslint-disable */

import React, { useEffect } from 'react'
import { getUserLoginApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { showErrorMsg } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { DEFAULT_APP_SETTINGS } from '../../../../../_poscommon/common/constants/Config';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken } from '../../../../../_poscommon/common/helpers/api_helpers/axiosHelper';
import { setBusnPartnerIdAndTokenInStorage } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { saveUserData } from '../../../../globalStore/features/user/userSlice';
import { RootState } from '../../../../globalStore/rootReducer';
import BusinessPartnerTypesEnum from '../../../../../_poscommon/common/enums/BusinessPartnerTypesEnum';

export default function VisitorLoadDefaultUser() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginUser = useSelector((state: RootState) => state.userData.userData);

    useEffect(() => {

        const getDefaultWalkThroughUserLogin = () => {
            const loginFormBody = {
                userName: DEFAULT_APP_SETTINGS.WALK_THROUGH_USER_NAME,
                password: DEFAULT_APP_SETTINGS.WALK_THROUGH_USER_PASS,
            }

            getUserLoginApi(loginFormBody)
                .then((res: any) => {
                    if (res?.data) {
                        const { token, user } = res?.data;
                        if (user != undefined && user != null) {
                            setAuthToken(token, user?.busnPartnerId);
                            setBusnPartnerIdAndTokenInStorage(user?.busnPartnerId, token);
                            dispatch(saveUserData(user));

                        }

                    }
                })
                .catch((err: any) => {
                   // showErrorMsg("An error occured. Please try again!");
                    console.error("error", err);
                });
        }

        
        //--if user already login and if 
        if(loginUser == undefined || loginUser == undefined || loginUser.busnPartnerTypeId != BusinessPartnerTypesEnum.Customer || (loginUser.isWalkThroughCustomer == undefined || loginUser.isWalkThroughCustomer == false)){
            getDefaultWalkThroughUserLogin();
          
        }
       


    }, [])


    return (
        <div>VisitorLoadDefaultUser</div>
    )
}
