
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../SiteErrorMessage';
import { gerOrderItemVariantsDetailsApi, getOrderDetailsByIdApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { getDateCommonFormatFromJsonDate, makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { GetDefaultCurrencySymbol, getOrderDetailStatusBoundaryClass } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';


interface OrderItemVariantsDetailsModalInterface {
    isOpen: boolean,
    closeModal: any,
    orderId: any,
    orderItemId: number

}



const OrderItemVariantsDetailsModal: React.FC<OrderItemVariantsDetailsModalInterface> = ({
    isOpen,
    closeModal,
    orderId,
    orderItemId

}) => {
    const [orderVariantsList, setOrderVariantsList] = useState<any>({});

    const getIconSymbolForVariant = (index: number) => {
        switch (index) {
          case 0:
            return (
              <div className='symbol-label bg-light-danger'>
                <KTIcon iconName='abstract-26' className='fs-1 text-danger' />
              </div>
            );
          case 1:
            return (
              <div className='symbol-label bg-light-info'>
                <KTIcon iconName='bucket' className='fs-1 text-info' />
              </div>
            );
          case 2:
            return (
              <div className='symbol-label bg-light-success'>
                <KTIcon iconName='basket' className='fs-1 text-success' />
              </div>
            );
          case 3:
            return (
              <div className='symbol-label bg-light-primary'>
                <KTIcon iconName='cheque' className='fs-1 text-primary' />
              </div>
            );
          default:
            return (
              <div className='symbol-label bg-light-danger'>
                <KTIcon iconName='abstract-26' className='fs-1 text-danger' />
              </div>
            );
        }
      };
      

    useEffect(() => {
        gerOrderItemVariantsDetailsService();
    }, [orderId]);

    const gerOrderItemVariantsDetailsService = () => {


        gerOrderItemVariantsDetailsApi(orderId, orderItemId)
            .then((res: any) => {

                const { data } = res;
                if (data) {
                    setOrderVariantsList(res?.data);
                } else {
                    setOrderVariantsList({});
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"cashier-medium-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Order Variants Details</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form

                >
                    <div className='modal-body py-lg-10 px-lg-10 custom-modal-height'>

                        <div className="row">
                            {orderVariantsList && orderVariantsList.length > 0 ? (
                                orderVariantsList.map((record: any, index: number) => (
                                  

                                    <div className='col-md-4' key={index}>
                                        <div className='d-flex align-items-center me-2'>
                                            
                                            <div className='symbol symbol-50px me-3'>
                                               {getIconSymbolForVariant(index)}
                                            </div>
                                         
                                            <div>
                                                <div className='fs-4 text-gray-900 fw-bold'> {record.attributeDisplayName}</div>
                                                <div className='fs-7 text-muted fw-semibold'> {record.primaryKeyDisplayText}</div>
                                            </div>
                                         
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No variants found</p>
                            )}
                        </div>



                    </div>

                    <div className='admin-modal-footer'>
                        <button className="btn btn-light" onClick={closeModal}>Close</button>

                    </div>
                </form>
            </div>


        </ReactModal>
    )
}

export default OrderItemVariantsDetailsModal;