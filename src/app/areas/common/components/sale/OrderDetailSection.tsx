import React, { useEffect, useState } from 'react'
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import { getOrderDetailsByIdApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faComment, faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';
import { GetDefaultCurrencySymbol, getOrderDetailStatusBoundaryClass } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { getDateCommonFormatFromJsonDate } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { Link } from 'react-router-dom';
import OrderReceiptModal from './OrderReceiptModal';
import OrderItemVariantsDetailsModal from './OrderItemVariantsDetailsModal';

type FormInputs = {
    orderId: number;

}



export default function OrderDetailSection() {
    const params = useParams();
    const orderId = params.orderId;
    const [selectedOrderItemIdForVariant, setSelectedOrderItemIdForVariant] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState<any>({});
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);
    const [isOpenOrderItemVariantsModal, setIsOpenOrderItemVariantsModal] = useState<boolean>(false);

    const { control, register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<FormInputs>();

    const onSubmitOrderDetailForm = (data: any) => {
        return true;
    }

    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }
    const handleOpenCloseOrderVariantsModal = () => {
        setIsOpenOrderItemVariantsModal(!isOpenOrderItemVariantsModal);
    }

    useEffect(() => {
        getOrderDetailsByIdService();
    }, []);

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
        <>
            <KTCard>


                <KTCardBody className='py-4'>

                    <form className='form w-100'
                        onSubmit={(e) => {
                            handleSubmit(onSubmitOrderDetailForm)(e);

                        }}
                    >


                        <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-6 fs-6 pb-4" style={{ borderBottom: '0px' }}>
                            <li className="nav-item">
                                <a
                                    className="nav-link active text-active-primary fw-bolder"
                                    data-bs-toggle="tab"
                                    href="#kt_tab_pane_1"
                                >

                                    <FontAwesomeIcon icon={faCircleInfo} className='me-2' />
                                    Order Info
                                </a>

                            </li>
                            {/* <li className="nav-item ">
                    <a
                        className="nav-link text-active-primary fw-bolder"
                        data-bs-toggle="tab"
                        href="#kt_tab_pane_2"
                    >
                        <FontAwesomeIcon icon={faTruckFast} className='me-2' />
                        Shipping Details
                    </a>
                </li> */}


                            <li className="nav-item">
                                <a
                                    className="nav-link text-active-primary fw-bolder"
                                    data-bs-toggle="tab"
                                    href="#kt_tab_pane_3"
                                >
                                    <FontAwesomeIcon icon={faComment} className='me-2' />
                                    Order Note
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    className="nav-link text-active-primary fw-bolder"
                                    data-bs-toggle="tab"
                                    href="#kt_tab_pane_4"
                                >
                                    <FontAwesomeIcon icon={faCreditCard} className='me-2' />
                                    Payment Details
                                </a>
                            </li>




                        </ul>


                        <div className="tab-content" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="kt_tab_pane_1"
                                role="tabpanel"
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <div className='d-flex align-items-center bg-light-info rounded p-5'>

                                            <span className=' text-info me-5'>
                                                <KTIcon iconName='abstract-26' className='text-info fs-1 me-5' />
                                            </span>

                                            <div className='flex-grow-1 me-2'>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Order Id
                                                                </a>
                                                                <span className='text-muted fw-semibold d-block fs-7'> {orderDetails?.orderMainDetail?.orderId}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Order Number
                                                                </a>

                                                                <span className='text-muted fw-semibold d-block fs-7'> {orderDetails?.orderMainDetail?.orderNumber}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Order Status
                                                                </a>
                                                                <div className="d-flex  align-content-center mt-1">
                                                                    <span className={getOrderDetailStatusBoundaryClass(orderDetails?.orderMainDetail?.latestStatusId)}></span>
                                                                    <span className='text-muted fw-semibold d-block fs-7 ms-3'>
                                                                        {orderDetails?.orderMainDetail?.latestStatusName}
                                                                    </span>
                                                                </div>


                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Customer Name
                                                                </a>
                                                                <span className='text-muted fw-semibold d-block fs-7'>   {orderDetails?.orderMainDetail?.customerName}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="separator mb-4 mt-4"></div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Customer Mobile
                                                                </a>
                                                                <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.orderMainDetail?.customerMobileNo}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Order Date
                                                                </a>
                                                                <span className='text-muted fw-semibold d-block fs-7'> {getDateCommonFormatFromJsonDate(orderDetails?.orderMainDetail?.orderDateUtc)}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Order Total
                                                                </a>
                                                                <span className='text-muted fw-semibold d-block fs-7'>{GetDefaultCurrencySymbol()}{orderDetails?.orderMainDetail?.orderTotal}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-3 col-3">
                                                        <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                            <div className='flex-grow-1 me-2'>
                                                                <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                    Created By
                                                                </a>
                                                                <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.orderMainDetail?.createdByUserName}</span>
                                                            </div>
                                                            {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="separator mb-4 mt-4"></div>

                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="d-flex justify-content-end">
                                                            <a href="#" className="btn btn-primary"
                                                                onClick={handleOpenCloseOrderReceiptModal}
                                                            >
                                                                <FontAwesomeIcon icon={faPlus} className='me-2' />
                                                                Create Receipt</a>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>


                                        </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'>

                                            <span className=' text-warning me-5'>
                                                <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
                                            </span>

                                            <div className='flex-grow-1 me-2'>
                                                <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    Order Items
                                                </a>

                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        {/* <UsersTable /> */}
                                                        <KTCardBody className='py-4'>
                                                            <div className='table-responsive'>
                                                                <table
                                                                    id='kt_table_users'
                                                                    className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                                                >
                                                                    <thead>
                                                                        <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light-info'
                                                                            style={{ border: '1.5px solid #f6c000' }}
                                                                        >
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Order Item ID</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Product</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Price</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Quantity</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Item Total</th>

                                                                            <th colSpan={1} role="columnheader" className="text-center min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='text-gray-600 fw-bold'>

                                                                        {
                                                                            orderDetails?.orderItems != undefined && orderDetails?.orderItems?.length > 0
                                                                                ?
                                                                                orderDetails?.orderItems?.map((record: any) => (
                                                                                    <tr>
                                                                                        <td className='ps-3'>
                                                                                            <span className="text-muted fw-semibold text-muted d-block fs-7">{record.orderItemId}</span>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className='d-flex align-items-center'>
                                                                                                <div className='symbol symbol-45px me-5'>
                                                                                                    <img src={toAbsoluteUrlCustom(record.productDefaultImage)} alt='' />
                                                                                                </div>
                                                                                                <div className='d-flex justify-content-start flex-column'>
                                                                                                    <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                        {record.productName}
                                                                                                    </a>
                                                                                                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                                                        Fast Food
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>


                                                                                        <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{GetDefaultCurrencySymbol()}{record.price}</td>
                                                                                        <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.quantity}</td>
                                                                                        <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{GetDefaultCurrencySymbol()}{record.orderItemTotal}</td>

                                                                                        <td className='text-end pe-3'>

                                                                                            <Link
                                                                                                to={''}
                                                                                                onClick={() => {
                                                                                                    handleOpenCloseOrderVariantsModal(); // First function call
                                                                                                    setSelectedOrderItemIdForVariant(record.orderItemId); // Second function call
                                                                                                }}

                                                                                                className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                                                                                            >
                                                                                                <KTIcon iconName='eye' className='fs-3' />

                                                                                                View Attributes
                                                                                            </Link>

                                                                                        </td>
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




                                                                    </tbody>
                                                                </table>
                                                            </div>





                                                        </KTCardBody>
                                                    </div>
                                                </div>

                                            </div>



                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/*                                     
                <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">

                </div> */}

                            <div className="tab-pane fade" id="kt_tab_pane_3" role="tabpanel">

                                <div className="row">
                                    <div className="col-12">
                                        <div className='d-flex align-items-center bg-light-info rounded p-5'>

                                            <span className=' text-info me-5'>
                                                <KTIcon iconName='abstract-26' className='text-info fs-1 me-5' />
                                            </span>

                                            <div className='flex-grow-1 me-2'>
                                                <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    Order Notes
                                                </a>

                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        {/* <UsersTable /> */}
                                                        <KTCardBody className='py-4'>
                                                            <div className='table-responsive'>
                                                                <table
                                                                    id='kt_table_users'
                                                                    className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                                                >
                                                                    <thead>
                                                                        <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light-info'
                                                                            style={{ border: '1.5px solid #7239EA' }}
                                                                        >
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Order Note Id</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Message</th>

                                                                            <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Created On</th>



                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='text-gray-600 fw-bold'>

                                                                        {
                                                                            orderDetails?.orderNotesEntities != undefined && orderDetails?.orderNotesEntities?.length > 0
                                                                                ?
                                                                                orderDetails?.orderNotesEntities?.map((record: any) => (
                                                                                    <tr>
                                                                                        <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.orderNoteID}</td>

                                                                                        <td className='ps-3'>
                                                                                            <div className='d-flex align-items-center'>

                                                                                                <div className='d-flex justify-content-start flex-column'>
                                                                                                    <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                        {record.message}
                                                                                                    </a>

                                                                                                </div>
                                                                                            </div>
                                                                                        </td>





                                                                                        <td>
                                                                                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                                                {getDateCommonFormatFromJsonDate(record.createdOn)}
                                                                                            </span>
                                                                                        </td>

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




                                                                    </tbody>
                                                                </table>
                                                            </div>





                                                        </KTCardBody>
                                                    </div>
                                                </div>


                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="tab-pane fade" id="kt_tab_pane_4" role="tabpanel">

                                <div className="row">
                                    <div className="col-12 mt-4">
                                        <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'>

                                            <span className=' text-warning me-5'>
                                                <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
                                            </span>

                                            <div className='flex-grow-1 me-2'>
                                                <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-6'>
                                                    Payment Details
                                                </a>

                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        {/* <UsersTable /> */}
                                                        <KTCardBody className='py-4'>
                                                            <div className='table-responsive'>
                                                                <table
                                                                    id='kt_table_users'
                                                                    className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                                                >
                                                                    <thead>
                                                                        <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light-info'
                                                                            style={{ border: '1.5px solid #f6c000' }}
                                                                        >
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Payment Method Name</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Milestone Name</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Milestone Value</th>
                                                                            <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Payment Date</th>



                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='text-gray-600 fw-bold'>

                                                                        {
                                                                            orderDetails?.orderPaymentDetails != undefined && orderDetails?.orderPaymentDetails?.length > 0
                                                                                ?
                                                                                orderDetails?.orderPaymentDetails?.map((record: any) => (
                                                                                    <tr>
                                                                                        <td className='ps-3'>
                                                                                            <div className='d-flex align-items-center'>

                                                                                                <div className='d-flex justify-content-start flex-column'>
                                                                                                    <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                        {record.paymentMethodName}
                                                                                                    </a>

                                                                                                </div>
                                                                                            </div>
                                                                                        </td>


                                                                                        <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.milestoneName}</td>

                                                                                        <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{GetDefaultCurrencySymbol()}{record.milestoneValue}</td>
                                                                                        <td>
                                                                                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                                                {getDateCommonFormatFromJsonDate(record.paymentDate)}
                                                                                            </span>
                                                                                        </td>

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




                                                                    </tbody>
                                                                </table>
                                                            </div>





                                                        </KTCardBody>
                                                    </div>
                                                </div>

                                            </div>



                                        </div>
                                    </div>
                                </div>

                            </div>



                        </div>


                    </form>

                    {
                        isOpenReceiptModal == true
                            ?

                            <OrderReceiptModal
                                isOpen={isOpenReceiptModal}
                                closeModal={handleOpenCloseOrderReceiptModal}
                                orderId={orderId}
                            />
                            :
                            <>
                            </>
                    }

                    {
                        isOpenOrderItemVariantsModal == true
                            ?

                            <OrderItemVariantsDetailsModal
                                isOpen={isOpenOrderItemVariantsModal}
                                closeModal={handleOpenCloseOrderVariantsModal}
                                orderId={orderId}
                                orderItemId={selectedOrderItemIdForVariant}
                            />
                            :
                            <>
                            </>
                    }



                </KTCardBody>

            </KTCard>
        </>
    )
}
