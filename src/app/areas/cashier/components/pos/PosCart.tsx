/* eslint-disable */

import { faBroom, faBroomBall, faPaperPlane, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../globalStore/rootReducer';
import { getCustomerInfoPointOfSaleCartApi, getOrderDetailsByIdApi, getProductsListByProductIdsApi, inserUpdateBusinessPartnerApi, postCustomerOrderApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { showErrorMsg, showInfoMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { generateSimpleRandomPassword, makeAnyStringShortAppenDots, valueRoundToDecimalPlaces } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { clearCartItemsRedux, removeCartItemFromRedux, updateCartItemInRedux } from '../../../../globalStore/features/cartItem/cartItemsSlice';
import { paymentMethodsConst } from '../../../../../_poscommon/common/enums/GlobalEnums';
import ReactSelect from 'react-select';
import PosCustomerAddForm from './PosCustomerAddForm';
import BusinessPartnerTypesEnum from '../../../../../_poscommon/common/enums/BusinessPartnerTypesEnum';
import OrderReceiptModal from '../../../common/components/sale/OrderReceiptModal';
import { calculateCartItemTotals, calculateProductItemAdditionalPrice, placeAndConfirmCustomerOrder, updateProductQuantity } from '../../../../../_poscommon/common/helpers/global/OrderHelper';
import OrderPosSubTotal from '../../../common/components/sale/OrderPosSubTotal';
import OrderCartItems from '../../../common/components/sale/OrderCartItems';


export default function PosCart(props: { diningOption: number }) {
    const { diningOption } = props;
    const dispatch = useDispatch();
    const cartItemsSession = useSelector((state: RootState) => state.cartItems.cartItems);
    const [cartProductsData, setCartProductsData] = useState<any>([]);
    const [CartSubTotal, setCartSubTotal] = useState<number>(0);
    const [ShippingSubTotal, setShippingSubTotal] = useState<number>(0);
    const [orderTaxesTotal, setOrderTaxesTotal] = useState<number>(0);
    const [variantAdditionalChargesTotal, setVariantAdditionalChargesTotal] = useState<number>(0);
    const [OrderTotal, setOrderTotal] = useState<number>(0);
    const [selectedTaxObjectForOrder, setSelectedTaxObjectForOrder] = useState<any>({});
    const [orderBasedTaxesFinal, setOrderBasedTaxesFinal] = useState<any>([]);

    const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<number>(paymentMethodsConst.cashOnDelivery);
    const [isOpenAddCustomerForm, setIsOpenAddCustomerForm] = useState<boolean>(false);
    const [isCouponCodeApplied, setIsCouponCodeApplied] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string>('');
    const [orderDetails, setOrderDetails] = useState<any>({});
    const [latestOrderId, setLatestOrderId] = useState<any>(null);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    const loginUser = useSelector((state: RootState) => state.userData.userData);

    const [searchQueryCustomer, setSearchQueryCustomer] = useState('');
    const [selectedCustomerOptions, setSelectedCustomerDropDownOptions] = useState([]);
    const [selectedCustomerDropDown, setSelectedCustomerDropDown] = useState<any>(null);
    const [selectedCustomerObject, setSelectedCustomerObject] = useState<any>(null);
    const [allCustomers, setAllCustomers] = useState<any>(null);
    // Handler for changing the selected customer
    const handleSelectCustomerDropDown = (selectedOption: any) => {
        // Set the selected customer state

        setSelectedCustomerDropDown(selectedOption);
        setSelectedCustomerObject(allCustomers?.find((x: { busnPartnerId: any; }) => x.busnPartnerId == selectedOption?.value));
    };


    const getProductMainImage = (productImagesJson: string) => {
        if (!stringIsNullOrWhiteSpace(productImagesJson)) {
            const productImages = JSON.parse(productImagesJson ?? '[]');
            return productImages[0]?.AttachmentURL;
        } else {
            return '';
        }
    }

    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }

    const createCartQuantity = (productId: number) => {
        return cartItemsSession.find(x => x.productId == productId)?.quantity;
    }

    const handleQtyChange = (e: any, selectedProduct: any, clickType: string) => {
        e.preventDefault();

        const result = updateProductQuantity(
            cartItemsSession,
            cartProductsData,
            selectedProduct,
            clickType
        );

        if (!result.success) {
            // Handle error case, e.g., show an error message
            if (result.errorMessage) {
                console.error(result.errorMessage); // or showErrorMsg(result.errorMessage)
                showErrorMsg(result.errorMessage)
            } else {
                showErrorMsg('An error occured!')
            }
            return; // Exit early, operation was not successful
        }

        setCartProductsData(result.updatedCartProductsData); // Update state with new data

        if (result.updatedCartItem) {
            dispatch(updateCartItemInRedux(result.updatedCartItem)); // Dispatch the updated cart item
        }

    }




    const clearCart = (e: any) => {
        e.preventDefault();
        dispatch(clearCartItemsRedux());
    }
    const removeProductFromCart = (e: any, productId: number) => {
        e.preventDefault();
        dispatch(removeCartItemFromRedux({ productId: productId }));
    }

    const handleOpenCloseCustomerAddModal = () => {
        setIsOpenAddCustomerForm(!isOpenAddCustomerForm);

    }


    const handleUserFormSubmit = (data: any) => {


        console.log('data user: ', data); // Handle form submission here
        const { firstName, lastName, emailAddress, countryId, addressOne, phoneNo, userProfileImage } = data;
        const countryIdLocal = countryId?.value;
        if (stringIsNullOrWhiteSpace(firstName) || stringIsNullOrWhiteSpace(countryIdLocal)
            || stringIsNullOrWhiteSpace(phoneNo)
        ) {
            showErrorMsg('Please fill all required fields');
            return;
        }

        let password = generateSimpleRandomPassword(8);


        const formData = new FormData();
        formData.append('busnPartnerId', '0');
        formData.append('firstName', firstName ?? '');
        formData.append('lastName', lastName ?? '');
        formData.append('emailAddress', emailAddress ?? '');
        formData.append('busnPartnerTypeId', BusinessPartnerTypesEnum.Customer);
        formData.append('IsActive', 'true');
        formData.append('isVerified', 'true');
        formData.append('countryId', countryIdLocal ?? '0');
        formData.append('addressOne', addressOne ?? '');
        formData.append('phoneNo', phoneNo ?? '');
        formData.append('password', password ?? '');

        formData.append('userProfileImage', userProfileImage[0]); // Assuming userProfileImage is a FileList. Currently it will go as null bcz its dispaly is null
        formData.append('profilePictureId', '0');


        inserUpdateBusinessPartnerApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");

                    if (res?.data?.response?.primaryKeyValue && res?.data?.response?.primaryKeyValue > 0) {
                        const insertedCustomerId = res?.data?.response?.primaryKeyValue;
                        getCustomerInfoPointOfSaleCartService(insertedCustomerId);
                    }

                    //--clear form
                    setTimeout(() => {
                        setIsOpenAddCustomerForm(false);
                    }, 500);

                } else if (res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
                    showErrorMsg(res?.data?.response?.responseMessage);
                }
                else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });

    }


    // const placeAndConfirmCustomerOrder = (StripPaymentToken: any, payPalOrderConfirmJson = "{}") => {

    //     try {




    //         const paramOrder = {
    //             customerId: selectedCustomerObject.busnPartnerId,
    //             orderNote: 'Customer Order',
    //             cartJsonData: JSON.stringify(cartProductsData),
    //             couponCode: isCouponCodeApplied == true ? couponCode : "",
    //             paymentMethod: defaultPaymentMethod,
    //             paymentToken: StripPaymentToken ?? "",
    //             payPalOrderConfirmJson: payPalOrderConfirmJson ?? "",
    //             cartSubTotal: CartSubTotal,
    //             shippingSubTotal: ShippingSubTotal,
    //             orderTotal: OrderTotal

    //         };


    //         postCustomerOrderApi(paramOrder)
    //             .then((res: any) => {

    //                 if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!")) {
    //                     showSuccessMsg("Order Placed Successfully!");
    //                     setTimeout(function () {
    //                         //--clear customer cart
    //                         dispatch(clearCartItemsRedux());
    //                         setSelectedCustomerObject(null);
    //                         setSelectedCustomerDropDownOptions([]);

    //                         //--set latest order id
    //                         const orderIdLocal = res?.data?.response?.primaryKeyValue;
    //                         console.log('Order id is: ', orderIdLocal);
    //                         if (orderIdLocal && parseInt(orderIdLocal) > 0) {
    //                             setLatestOrderId(res?.data?.response?.primaryKeyValue);
    //                             setIsOpenReceiptModal(true);
    //                         }


    //                     }, 500);

    //                     return res?.data?.response;

    //                 } else {
    //                     showErrorMsg("An error occured. Please try again!");
    //                 }

    //             })
    //             .catch((err: any) => {
    //                 console.error(err, "err");
    //                 showErrorMsg("An error occured. Please try again!");
    //             });



    //         if (defaultPaymentMethod == paymentMethodsConst.stripe) {
    //             //HandleStripCardModal();
    //         } else if (defaultPaymentMethod == paymentMethodsConst.payPal) {
    //             // HandlePaypalCardModal();
    //         }





    //     } catch (err: any) {
    //         showErrorMsg("An error occured. Please try again!");
    //         console.log(err.message);
    //         if (defaultPaymentMethod == paymentMethodsConst.stripe) {
    //             //HandleStripCardModal();
    //         }

    //         //--stop loader
    //         // setTimeout(() => {
    //         //     dispatch(rootAction.commonAction.setLoading(false));
    //         // }, LOADER_DURATION);

    //     }


    // }



    const handleCheckoutOnSubmit = (e: any) => {


        try {
            e.preventDefault();

            if (selectedCustomerObject == undefined || selectedCustomerObject == null || selectedCustomerObject?.busnPartnerId < 1) {
                showErrorMsg('Please select customer first!');
                return false;
            }

            //-- First Disable all forms
            //setshowCardSectionStripe(false); //✅ Enable when stripe integrated
            //setshowCardSectionPaypal(false); //✅  Enable when payPayl integrated

            if (defaultPaymentMethod == paymentMethodsConst.stripe) {
                //setshowCardSectionStripe(true);
            } else if (defaultPaymentMethod == paymentMethodsConst.payPal) {
                // setshowCardSectionPaypal(true);
            }
            else if (defaultPaymentMethod == paymentMethodsConst.cashOnDelivery) {
                let isYes = window.confirm("Do you really want place order?");
                if (isYes) {

                    //--start loader
                    // dispatch(rootAction.commonAction.setLoading(true));


                    //placeAndConfirmCustomerOrder(null);
                    // Call the helper function and handle the promise with .then()
                    placeAndConfirmCustomerOrder(
                        cartProductsData,
                        selectedCustomerObject,
                        couponCode,
                        defaultPaymentMethod,
                        diningOption,
                        CartSubTotal,
                        ShippingSubTotal,
                        OrderTotal,
                        orderBasedTaxesFinal,
                        null,
                        null
                    )
                        .then((result) => {
                            if (result.success) {
                                showSuccessMsg("Order Placed Successfully!");

                                // Clear the cart in Redux and perform other state updates
                                dispatch(clearCartItemsRedux());

                                // Additional actions based on the result
                                if (result.orderId) {
                                    setLatestOrderId(result.orderId);
                                    setIsOpenReceiptModal(true); // Open receipt modal
                                }
                            } else {
                                // Handle errors based on the returned message
                                if (result.errorMessage) {
                                    console.error(result.errorMessage);
                                    showErrorMsg(result.errorMessage);
                                }
                            }
                        })
                        .catch((err) => {
                            // Catch any unexpected errors
                            console.error("An error occurred while placing the order:", err);
                            showErrorMsg("An unexpected error occurred. Please try again.");
                        });

                    //--stop loader
                    // setTimeout(() => {
                    //     dispatch(rootAction.commonAction.setLoading(false));
                    // }, LOADER_DURATION);

                }
            }
        } catch (err: any) {
            showErrorMsg("An error occured. Please try again!");
            console.log(err.message);
            if (defaultPaymentMethod === paymentMethodsConst.stripe) {
                // HandleStripCardModal();
                // HandlePaypalCardModal();
            }

            //--stop loader
            // setTimeout(() => {
            //     dispatch(rootAction.commonAction.setLoading(false));
            // }, LOADER_DURATION);
        }



    }




    // calculate value fields like order total etc
    useEffect(() => {


        //--calculate other amounts fields
        const processProducts = async () => {


            let cartSubTotalLocal = 0;
            let shippingSubTotalLocal = 0;
            let orderTaxesTotalLocal = 0;
            let variantAdditionalChargesLocal = 0;
            let orderTotalLocal = 0;


            for (const item of cartProductsData) {

                const productAllAttributesForInventory = item.productAttributesForInventory || [];

                // Find selected attributes
                const productSelectedAttributes = cartItemsSession.find(
                    x => x.productId === item?.productId
                )?.productSelectedAttributes;


                const additionalPrice = calculateProductItemAdditionalPrice(
                    productAllAttributesForInventory,
                    productSelectedAttributes
                );


                const customerProduct = cartItemsSession.find(x => x.productId === item.productId);
                item.quantity = customerProduct ? customerProduct.quantity : 0;




                if (item.discountId > 0) {
                    item.orderItemDiscount = item.price - item.discountedPrice;
                    item.orderItemDiscount = item.orderItemDiscount * item.quantity;
                }

                
                // item.productSelectedAttributes = valueRoundToDecimalPlaces(customerProduct?.productSelectedAttributes)

                const totalsValues = calculateCartItemTotals(
                    item,
                    additionalPrice,
                    cartSubTotalLocal,
                    shippingSubTotalLocal,
                    orderTaxesTotalLocal,
                    variantAdditionalChargesLocal,
                    orderTotalLocal
                );

                //--calculate sub totals
                cartSubTotalLocal = totalsValues.cartSubTotal;
                shippingSubTotalLocal = totalsValues.shippingSubTotal;
                orderTaxesTotalLocal = totalsValues.orderTaxesTotal;
                variantAdditionalChargesLocal = totalsValues.variantAdditionalChargesTotal;
                orderTotalLocal = totalsValues.orderTotal;



            }

            console.log('cart json data', cartProductsData);

            setCartSubTotal(cartSubTotalLocal);
            setShippingSubTotal(shippingSubTotalLocal);
            setOrderTaxesTotal(orderTaxesTotalLocal);
            setVariantAdditionalChargesTotal(variantAdditionalChargesLocal);



            //--calcualte order total tax
            if (selectedTaxObjectForOrder && selectedTaxObjectForOrder?.taxRuleId > 0) {
                let taxAmountOnOrderTotal = cartSubTotalLocal * ((selectedTaxObjectForOrder?.taxRate ?? 0) / 100)
                orderTotalLocal = orderTotalLocal + taxAmountOnOrderTotal;

                let orderTaxesFinalLocal: any = [
                    {
                        taxRuleId: selectedTaxObjectForOrder.taxRuleId,
                        taxRate: selectedTaxObjectForOrder.taxRate ?? 0,
                        taxAmount: taxAmountOnOrderTotal
                    }
                ]

                setOrderBasedTaxesFinal(orderTaxesFinalLocal);
            }


            setOrderTotal(orderTotalLocal);
        };
        processProducts();
    }, [cartItemsSession, cartProductsData, selectedTaxObjectForOrder]);


    // Fetch the products when the component mounts and if cartItemsSession changed
    useEffect(() => {
        //--Only fetch producs if necessary
        if (cartProductsData.length != cartItemsSession.length) {
            fetchProductsService();
        }

    }, [cartItemsSession]);


    const fetchProductsService = () => {
        const productIdsString = cartItemsSession?.map(product => product.productId).join(',');
        if (stringIsNullOrWhiteSpace(productIdsString)) {
            setCartProductsData([]);
            return false;
        }

        getProductsListByProductIdsApi(productIdsString)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    setCartProductsData(res?.data);

                }
            })
            .catch((err: any) => console.log(err, "err"));
    };


    // Fetch options when the search query changes
    useEffect(() => {
        if (searchQueryCustomer) {
            getCustomerInfoPointOfSaleCartService(0);
        } else {
            setSelectedCustomerDropDownOptions([]); // Clear options if search query is empty
        }
    }, [searchQueryCustomer]);

    //--if new user added from form then will pass searchByCustomerId to this funtion
    const getCustomerInfoPointOfSaleCartService = (searchByCustomerId: number) => {
        getCustomerInfoPointOfSaleCartApi(searchByCustomerId, searchQueryCustomer)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    const customerOptions = res?.data?.map((customer: any) => ({
                        value: customer.busnPartnerId,
                        label: `${customer.firstName} ${customer.lastName} (${customer.contactNo})`
                    }));

                    setSelectedCustomerDropDownOptions(customerOptions);
                    setAllCustomers(res?.data);


                    //--if new user added then set its data after inserting successfully
                    if (searchByCustomerId && searchByCustomerId > 0) {
                        setSelectedCustomerObject(res?.data[0]);
                    }

                }

            }).catch((error: any) => {
                console.error('Error fetching customer data:', error);
            });
    };

    return (
        <>
            <div className="card card-flush bg-body" id="kt_pos_form">

                <div className="card-header pt-5" style={{ paddingLeft: '1.125rem', paddingRight: '1.125rem' }}>
                    <h3 className="card-title fw-bold fs-3 mb-1">Current Order</h3>

                    <div className="card-toolbar">
                        <a href="#" className="btn btn-light-primary fs-6 fw-bold py-2" onClick={(e) => clearCart(e)}><FontAwesomeIcon className='me-1' icon={faBroom} /> Clear All</a>
                    </div>

                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-5 ms-5 mb-3 mt-2'>
                    <div className="row mb-4">
                        <div className="col-md-7 col-lg-7 col-7">
                            {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Search customer"
                            value={''}
                      
                        /> */}

                            {/* <ReactSelect

                            isMulti
                            options={productTagsOptions}
                        /> */}

                            <ReactSelect
                                isMulti={false}
                                isClearable={true}
                                placeholder="Search customer"
                                className=""
                                value={selectedCustomerDropDown}
                                onChange={handleSelectCustomerDropDown}
                                options={selectedCustomerOptions}
                                onInputChange={setSearchQueryCustomer}
                            />


                        </div>
                        <div className="col-md-5 col-lg-5 col-5 text-end">

                            <button className="btn btn-success cursor-pointer"
                                onClick={handleOpenCloseCustomerAddModal}
                            >
                                <FontAwesomeIcon icon={faUserPlus} className='fs-4 me-1' />
                                Customer</button>

                        </div>
                    </div>



                    <div className="d-flex justify-content-start gap-4">
                        <div className="fs-6 text-gray-800 fw-bold">Customer Name: <span className="fw-semibold text-gray-500">
                            {
                                !stringIsNullOrWhiteSpace(selectedCustomerObject?.firstName)
                                    ?
                                    `${selectedCustomerObject?.firstName} ${selectedCustomerObject?.lastName}`
                                    :
                                    'No Customer Selected'
                            }

                        </span></div>
                        <div className="fs-6 text-gray-800 fw-bold">Mobile: <span className="fw-semibold text-gray-500">{selectedCustomerObject?.contactNo}</span></div>

                    </div>



                </div>

                <div className="card-body pt-0" style={{ paddingLeft: '1.125rem', paddingRight: '1.125rem' }}>

                    <OrderCartItems
                        cartProductsData={cartProductsData}
                        getProductMainImage={getProductMainImage}
                        removeProductFromCart={removeProductFromCart}
                        handleQtyChange={handleQtyChange}
                        createCartQuantity={createCartQuantity}
                    />

                    <OrderPosSubTotal
                        CartSubTotal={CartSubTotal}
                        ShippingSubTotal={ShippingSubTotal}
                        orderTaxesTotal={orderTaxesTotal}
                        variantAdditionalChargesTotal={variantAdditionalChargesTotal}
                        OrderTotal={OrderTotal}
                        selectedTaxObjectForOrder={selectedTaxObjectForOrder}
                        setSelectedTaxObjectForOrder={setSelectedTaxObjectForOrder}

                        area={'cashier'}
                    />


                    <div className="m-0 mt-3">

                        <h1 className="fw-bold text-gray-800 mb-5">Payment Method</h1>

                        <div className="d-flex flex-equal gap-5 gap-xxl-9 px-0 mb-12" data-kt-buttons="true" data-kt-buttons-target="[data-kt-button]">

                            <label
                                className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${defaultPaymentMethod == paymentMethodsConst.cashOnDelivery ? 'active' : ''}`}
                            >

                                <input className="btn-check" type="radio" name="cashOnDelivery"
                                    value={paymentMethodsConst.cashOnDelivery}
                                    checked={defaultPaymentMethod == paymentMethodsConst.cashOnDelivery}
                                    onChange={() => setDefaultPaymentMethod(paymentMethodsConst.cashOnDelivery)}
                                />

                                <i className="ki-duotone ki-dollar fs-2hx mb-2 pe-0">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                </i>

                                <span className="fs-7 fw-bold d-block">Cash</span>

                            </label>

                            <label
                                className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${defaultPaymentMethod == paymentMethodsConst.stripe ? 'active' : ''}`}
                            >

                                <input className="btn-check" type="radio"
                                    name="stripe"
                                    value={paymentMethodsConst.stripe}
                                    checked={defaultPaymentMethod == paymentMethodsConst.stripe}
                                    onChange={() => setDefaultPaymentMethod(paymentMethodsConst.stripe)}
                                />

                                <i className="ki-duotone ki-credit-cart fs-2hx mb-2 pe-0">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                </i>

                                <span className="fs-7 fw-bold d-block">Card</span>

                            </label>

                            {/* <label
                                className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${defaultPaymentMethod == paymentMethodsConst.payPal ? 'active' : ''}`}
                            >

                                <input className="btn-check" type="radio"
                                    name="payPal"
                                    value={paymentMethodsConst.payPal}
                                    checked={defaultPaymentMethod == paymentMethodsConst.payPal}
                                    onChange={() => setDefaultPaymentMethod(paymentMethodsConst.payPal)}
                                />

                                <i className="ki-duotone ki-paypal fs-2hx mb-2 pe-0">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                </i>

                                <span className="fs-7 fw-bold d-block">PayPal</span>

                            </label> */}

                        </div>


                        <button className="btn btn-primary fs-3  w-100"
                            onClick={handleCheckoutOnSubmit}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} /> Place Order
                        </button>

                    </div>

                </div>

            </div>

            {
                isOpenReceiptModal == true
                    ?

                    <OrderReceiptModal
                        isOpen={isOpenReceiptModal}
                        closeModal={handleOpenCloseOrderReceiptModal}
                        orderId={latestOrderId}
                    />
                    :
                    <>
                    </>
            }





            {
                isOpenAddCustomerForm == true
                    ?

                    <PosCustomerAddForm
                        isOpen={isOpenAddCustomerForm}
                        closeModal={handleOpenCloseCustomerAddModal}
                        onSubmit={handleUserFormSubmit}
                    />
                    :
                    <>
                    </>
            }
        </>
    )
}
