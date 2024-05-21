/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { paymentMethodsConst } from '../../../../../_poscommon/common/enums/GlobalEnums'
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import { getCustomerInfoPointOfSaleCartApi, getProductsListByProductIdsApi, inserUpdateBusinessPartnerApi, postCustomerOrderApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../globalStore/rootReducer';
import { showErrorMsg, showInfoMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { clearCartItemsRedux, removeCartItemFromRedux, updateCartItemInRedux } from '../../../../globalStore/features/cartItem/cartItemsSlice';
import { generateSimpleRandomPassword, makeAnyStringShortAppenDots, valueRoundToDecimalPlaces } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import BusinessPartnerTypesEnum from '../../../../../_poscommon/common/enums/BusinessPartnerTypesEnum';
import { calculateCartItemTotals, calculateProductItemAdditionalPrice, placeAndConfirmCustomerOrder, updateProductQuantity } from '../../../../../_poscommon/common/helpers/global/OrderHelper';
import OrderPosSubTotal from '../../../common/components/sale/OrderPosSubTotal';
import OrderCartItems from '../../../common/components/sale/OrderCartItems';
import OrderReceiptModal from '../../../common/components/sale/OrderReceiptModal';

export default function VisitorCartArea(props: {diningOption: number}) {
    const {diningOption} = props;
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

    const [couponCode, setCouponCode] = useState<string>('');
    const [latestOrderId, setLatestOrderId] = useState<any>(null);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    const loginUser = useSelector((state: RootState) => state.userData.userData);

    const [selectedCustomerObject, setSelectedCustomerObject] = useState<any>(loginUser);


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
                    item.OrderItemDiscount = item.Price - item.DiscountedPrice;
                    item.OrderItemDiscount = item.OrderItemDiscount * item.Quantity;
                }

                item.productSelectedAttributes = valueRoundToDecimalPlaces(customerProduct?.productSelectedAttributes)

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
    }, [cartItemsSession, cartProductsData]);


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



    
    return (
        <>
            <div className="card card-flush">

                <div className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-start h-200px"

                    style={{
                        backgroundImage: `url('${toAbsoluteUrl(
                            'media/svg/shapes/top-green.png'
                        )}')`,

                    }}
                    data-bs-theme="light">

                    <h3 className="card-title align-items-start flex-column text-white pt-7">
                        <span className="fw-bold fs-2x mb-3">Current Order</span>

                    </h3>

                </div>

                <div className="card-body visitor-mt-n30 ps-4 pe-4">

                    <div className="mt-n20 position-relative">

                        <div className="row g-3 ">

                            <div className="col-12">

                                <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-1">

                                    <div className="m-1">

                                        <OrderCartItems
                                            cartProductsData={cartProductsData}
                                            getProductMainImage={getProductMainImage}
                                            removeProductFromCart={removeProductFromCart}
                                            handleQtyChange={handleQtyChange}
                                            createCartQuantity={createCartQuantity}
                                        />



                                    </div>

                                    <OrderPosSubTotal
                                        CartSubTotal={CartSubTotal}
                                        ShippingSubTotal={ShippingSubTotal}
                                        orderTaxesTotal = {orderTaxesTotal}
                                        variantAdditionalChargesTotal = {variantAdditionalChargesTotal}
                                        OrderTotal={OrderTotal}
                                        selectedTaxObjectForOrder = {selectedTaxObjectForOrder}
                                        setSelectedTaxObjectForOrder = {setSelectedTaxObjectForOrder}
                                        area='visitor'
                                    />




                                </div>

                            </div>

                        </div>

                    </div>



                </div>

            </div>

            <div className="card border-transparent  mt-3" data-bs-theme="light" style={{ backgroundColor: '#1C325E' }} >

                <div className="card-body d-flex ps-xl-15">

                    <div className="m-0">


                        <div className="m-0">

                            <div className="position-relative fs-1 z-index-2 fw-bold text-white mb-5">
                                <span className="me-2">
                                    Payment Methods
                                </span>
                            </div>

                            {/* <a className="text-danger opacity-75-hover fw-bold mb-5">Payment Method</a> */}

                            <div className="d-flex flex-equal gap-5 gap-xxl-9 px-0 mb-6" data-kt-buttons="true" data-kt-buttons-target="[data-kt-button]">

                                <label
                                    className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${defaultPaymentMethod == paymentMethodsConst.cashOnDelivery ? 'active' : ''}`}
                                >

                                    <input className="btn-check" type="radio" name="cashOnDelivery"
                                        value={paymentMethodsConst.cashOnDelivery}
                                        checked={defaultPaymentMethod == paymentMethodsConst.cashOnDelivery}
                                        onChange={() => setDefaultPaymentMethod(paymentMethodsConst.cashOnDelivery)}
                                    />

                                    <i className="ki-duotone ki-dollar fs-2x mb-0 pe-0">
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

                                    <i className="ki-duotone ki-credit-cart fs-2x mb-0 pe-0">
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

                                    <i className="ki-duotone ki-paypal fs-2x mb-0 pe-0">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>

                                    <span className="fs-7 fw-bold d-block">PayPal</span>

                                </label> */}

                            </div>




                        </div>

                        <div className="mb-3">
                            <button
                                className="btn btn-danger fw-semibold me-2"
                                onClick={handleCheckoutOnSubmit}>
                                Place Order
                            </button>


                        </div>

                    </div>

                    <img src={toAbsoluteUrl('media/illustrations/sigma-1/17-dark.png')} className="position-absolute me-0 mb-1 bottom-0 end-0 h-150px" alt="" />

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

        </>
    )
}
