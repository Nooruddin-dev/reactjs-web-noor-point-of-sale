/* eslint-disable */

import React, { useState } from 'react'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import ProductSelectionModal from './ProductSelectionModal';
import { showErrorMsg, showInfoMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../globalStore/rootReducer';
import { addItemToCartRedux } from '../../../../globalStore/features/cartItem/cartItemsSlice';
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';

export default function CashierProductBox(props: { productItem: any }) {
    const { productItem } = props;
    const dispatch = useDispatch();
    const productImages = JSON.parse(productItem?.productImagesJson ?? '[]');
    const onSale = productItem?.discountedPrice != undefined && productItem.discountedPrice != null && productItem.discountedPrice > 0;
    const cartItemsSession = useSelector((state: RootState) => state.cartItems.cartItems);

    const [isOpenProductSelectionModal, setIsOpenProductSelectionModal] = useState<boolean>(false);
    const handleOpenCloseProductSelctionModal = () => {
        setIsOpenProductSelectionModal(!isOpenProductSelectionModal);
    }

    const addProductToCart = (productId: number,
        quantity: number, productSelectedAttributes: any, defaultImage: string) => {

        try {


            const cartItems = [...(cartItemsSession ?? [])];


            //--check if product already exists
            if (cartItems?.filter(obj => obj.productId == productId).length > 0) {
                showInfoMsg("Product already exists in your cart!");
                return JSON.stringify(cartItems);
            } else {

                let cartItemCurrent = {
                    productId: productId,
                    productSelectedAttributes: productSelectedAttributes,
                    quantity: quantity,
                    shippingCharges: 0,
                    defaultImage: defaultImage
                }

                console.log(cartItemCurrent);


                dispatch(addItemToCartRedux(cartItemCurrent));

                showSuccessMsg("Added to the cart!");

            }
        }
        catch (err) {
            console.log(err);
            showErrorMsg("An error occured. Please try again!");

        }



    };

    return (
        <>
            <div className="card card-flush flex-row-fluid p-5 pb-5 mw-100">

                <div className="card-body text-center" style={{ padding: '2px', cursor: 'pointer' }}>

                    {
                        stringIsNullOrWhiteSpace(productImages[0]?.AttachmentURL) == true
                            ?
                            <img src={toAbsoluteUrl('media/stock/food/img-3.jpg')} className="rounded-3 mb-4 w-250px h-250px w-xxl-250px h-xxl-250px" alt=""
                                onClick={handleOpenCloseProductSelctionModal}
                            />
                            :
                            <img src={toAbsoluteUrlCustom(productImages[0]?.AttachmentURL)} className="rounded-3 mb-4 w-250px h-250px w-xxl-250px h-xxl-250px" alt=""
                                onClick={handleOpenCloseProductSelctionModal}
                            />
                    }


                    <div className="mb-2">

                        <div className="text-center">
                            <span className="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-3 fs-xl-1"
                                onClick={handleOpenCloseProductSelctionModal}
                            >{makeAnyStringShortAppenDots(productItem?.productName, 20)}</span>
                            <span className='product-id-test-div' style={{ display: 'none' }}>{productItem.productId}</span>
                            <span className="text-gray-500 fw-semibold d-block fs-6 mt-n1">{makeAnyStringShortAppenDots(productItem?.shortDescription, 30)}</span>
                        </div>

                    </div>

                    <div className='d-flex justify-content-center align-items-center'>
                        {
                            onSale == true
                                ?
                                <span className="cashier-old-price text-end fw-bold fs-1">{GetDefaultCurrencySymbol()}{productItem?.price}</span>
                                :
                                <></>
                        }

                        <span className="text-success text-end fw-bold fs-1">{GetDefaultCurrencySymbol()}{onSale == true ? productItem?.discountedPrice : productItem.price}</span>


                    </div>


                    <div className="pos-label-group">
                        {
                            productItem?.markAsNew == true
                                ?
                                <div className="pos-product-label pos-label-hot">New</div>
                                :
                                <></>
                        }

                        {
                            onSale == true
                                ?
                                <div className="pos-product-label pos-label-sale">On Sale</div>
                                :
                                <></>
                        }

                    </div>
                </div>

            </div>

            {
                isOpenProductSelectionModal == true
                    ?

                    <ProductSelectionModal
                        isOpen={isOpenProductSelectionModal}
                        closeModal={handleOpenCloseProductSelctionModal}
                        productId={productItem.productId}
                        handleAddToCart={addProductToCart}
                    />
                    :
                    <>
                    </>
            }


        </>

    )
}
