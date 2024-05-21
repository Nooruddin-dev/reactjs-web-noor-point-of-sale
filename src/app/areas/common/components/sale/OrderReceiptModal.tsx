
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../SiteErrorMessage';
import { getOrderDetailsByIdApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { getDateCommonFormatFromJsonDate, makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { GetDefaultCurrencySymbol, getOrderDetailStatusBoundaryClass } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

import { useReactToPrint } from 'react-to-print';

interface CashierOrderStatusFormInterface {
    isOpen: boolean,
    closeModal: any,
    orderId: any

}



const OrderReceiptModal: React.FC<CashierOrderStatusFormInterface> = ({
    isOpen,
    closeModal,
    orderId,

}) => {
    const [orderDetails, setOrderDetails] = useState<any>({});

    const customerName = orderDetails?.orderMainDetail?.isWalkThroughCustomer == true ? 'Customer' : (orderDetails?.orderMainDetail?.customerName ?? 'Customer')

    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Order Receipt',
      });



    useEffect(() => {
        getOrderDetailsByIdService();
    }, [orderId]);

    const getOrderDetailsByIdService = () => {


        getOrderDetailsByIdApi(orderId)
            .then((res: any) => {

                const { data } = res;
                if (data) {
                    setOrderDetails(res?.data);
                } else {
                    setOrderDetails({});
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"cashier-large-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Order Receipt</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form

                >
                    <div className='modal-body py-lg-10 px-lg-10 custom-modal-height'>


                        <div className="card" ref={componentRefForReceipt}>

                            <div className="card-body py-5">

                                <div className="mw-lg-950px mx-auto w-100">

                                    <div className="d-flex justify-content-between flex-column flex-sm-row mb-19">
                                        <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">ORDER RECEIPT</h4>

                                        <div className="text-sm-end">

                                            <a href="#" className="d-block mw-150px ms-sm-auto">
                                                <img alt="Logo"
                                                    src={toAbsoluteUrl('media/svg/brand-logos/lloyds-of-london-logo.svg')}
                                                    className="w-100" />
                                            </a>

                                            <div className="text-sm-end fw-semibold fs-4 text-muted mt-7">
                                                <div>Cecilia Chapman, 711-2880 Nulla St, Mankato</div>
                                                {/* <div>Mississippi 96522</div> */}
                                            </div>

                                        </div>
                                    </div>

                                    <div className="pb-12">

                                        <div className="d-flex flex-column gap-7 gap-md-10">

                                            <div className="fw-bold fs-2">Dear {customerName}

                                                {
                                                    !stringIsNullOrWhiteSpace(orderDetails?.orderMainDetail?.customerEmailAddress) && orderDetails?.orderMainDetail?.isWalkThroughCustomer != true
                                                        ?
                                                        <span className="fs-6">({orderDetails?.orderMainDetail?.customerEmailAddress})</span>
                                                        :
                                                        <></>
                                                }

                                                <br />
                                                <span className="text-muted fs-5">Here are your order details. We thank you for your purchase.</span></div>

                                            <div className="separator"></div>

                                            <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold">
                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Order ID</span>
                                                    <span className="fs-5">{orderDetails?.orderMainDetail?.orderNumber}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Mobile No:</span>
                                                    <span className="fs-5">{orderDetails?.orderMainDetail?.customerMobileNo ?? 'Not selected'}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Created By</span>
                                                    <span className="fs-5">{orderDetails?.orderMainDetail?.createdByUserName}</span>
                                                </div>
                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Status</span>
                                                    <div className="d-flex  align-content-center mt-1">
                                                        <span className={getOrderDetailStatusBoundaryClass(orderDetails?.orderMainDetail?.latestStatusId)}></span>
                                                        <span className='text-muted fw-semibold d-block fs-7 ms-3'>
                                                            {orderDetails?.orderMainDetail?.latestStatusName}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold ">
                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Order Date</span>
                                                    {/* <span className="fs-5">12 January, 2024</span>  */}
                                                    <span className="fs-7 text-danger d-flex align-items-center">
                                                        <span className=" bg-danger"></span>
                                                        {getDateCommonFormatFromJsonDate(orderDetails?.orderMainDetail?.orderDateUtc)}
                                                    </span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Shipping Address</span>
                                                    <span className="fs-6">{makeAnyStringShortAppenDots(orderDetails?.orderShippingMaster?.addressOne, 55)}
                                                        {/* <br />Melbourne 3000, */}
                                                        <br />{orderDetails?.orderShippingMaster?.cityName ?? 'No city selected'},
                                                        <br />{orderDetails?.orderShippingMaster?.countryName}.</span>
                                                </div>



                                            </div>

                                            <div className="d-flex justify-content-between flex-column">

                                                <div className="table-responsive border-bottom mb-9">
                                                    <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                                                        <thead>
                                                            <tr className="border-bottom fs-6 fw-bold text-muted">
                                                                <th className="min-w-175px pb-2">Order Item ID</th>
                                                                <th className="min-w-175px pb-2">Products</th>
                                                                <th className="min-w-70px text-end pb-2">Price</th>
                                                                <th className="min-w-80px text-end pb-2">QTY</th>
                                                                <th className="min-w-100px text-end pb-2">Item Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="fw-semibold text-gray-600">

                                                            {
                                                                orderDetails?.orderItems != undefined && orderDetails?.orderItems?.length > 0
                                                                    ?
                                                                    orderDetails?.orderItems?.map((record: any) => (
                                                                        <tr>
                                                                            <td className="text-start">{record.orderItemId}</td>

                                                                            <td className='text-start'>
                                                                                <div className="d-flex align-items-center">

                                                                                    <a href="#" className="symbol symbol-50px">
                                                                                        <span className="symbol-label"
                                                                                            style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.productDefaultImage)})` }}
                                                                                        ></span>
                                                                                    </a>

                                                                                    <div className="ms-5">
                                                                                        <div className="fw-bold">  {record.productName}</div>
                                                                                        {/* <div className="fs-7 text-muted">Attribute Names Only</div> */}
                                                                                    </div>

                                                                                </div>
                                                                            </td>

                                                                            <td className="text-end">{GetDefaultCurrencySymbol()}{record.price}</td>
                                                                            <td className="text-end">{record.quantity}</td>

                                                                            <td className="text-end">{GetDefaultCurrencySymbol()}{record.orderItemTotal}</td>
                                                                        </tr>
                                                                    ))
                                                                    :
                                                                    <tr>
                                                                        <td colSpan={20}>
                                                                            <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                                                                No matching records found
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                            }




                                                            {/* <tr>
                                                                <td colSpan={4} className="text-end">Subtotal</td>
                                                                <td className="text-end">$264.00</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td colSpan={4} className="text-end">VAT (Taxes)</td>
                                                                <td className="text-end">{GetDefaultCurrencySymbol()}{orderDetails?.orderMainDetail?.orderTax ?? 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4} className="text-end">Shipping Charges</td>
                                                                <td className="text-end">{GetDefaultCurrencySymbol()}{orderDetails?.orderMainDetail?.orderTotalShippingCharges ?? 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4} className="fs-3 text-gray-900 fw-bold text-end">Grand Total</td>
                                                                <td className="text-gray-900 fs-3 fw-bolder text-end">{GetDefaultCurrencySymbol()}{orderDetails?.orderMainDetail?.orderTotal}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>

                                        </div>

                                    </div>



                                </div>

                            </div>

                        </div>


                    </div>

                    <div className='admin-modal-footer'>
                        <button className="btn btn-light" onClick={closeModal}>Close</button>
                        <button type="button" className="btn btn-success my-1 me-12" onClick={handlePrintReceipt}>

                            <FontAwesomeIcon icon={faPrint} className='me-2' />
                            Print Receipt

                        </button>
                        {/* <button className="btn btn-danger" type='submit'>Update</button> */}
                    </div>
                </form>
            </div>


        </ReactModal>
    )
}

export default OrderReceiptModal;