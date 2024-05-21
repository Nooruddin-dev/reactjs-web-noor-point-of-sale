import React, { useState } from 'react'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import { showErrorMsg, showInfoMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../globalStore/rootReducer';
import { makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import ProductSelectionModal from '../../../cashier/components/pos/ProductSelectionModal';
import { addItemToCartRedux } from '../../../../globalStore/features/cartItem/cartItemsSlice';

export default function VisitorProductBox(props: { productItem: any }) {
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

                const cartItemCurrent = {
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
            <div style={{ position: 'relative' }}>
                <a className="d-block overlay" data-fslightbox="lightbox-hot-sales" href="#">

                    {
                        stringIsNullOrWhiteSpace(productImages[0]?.AttachmentURL) == true
                            ?
                            <div className="overlay-wrapper bgi-position-center bgi-no-repeat bgi-size-cover h-200px card-rounded mb-3"

                                style={{
                                    backgroundImage: `url('${toAbsoluteUrl(
                                        'media/stock/food/img-3.jpg'
                                    )}')`,
                                    height: '266px'
                                }}
                            >

                            </div>

                            :
                            <div className="overlay-wrapper bgi-position-center bgi-no-repeat bgi-size-cover h-200px card-rounded mb-3"

                                style={{
                                    backgroundImage: `url('${toAbsoluteUrlCustom(productImages[0]?.AttachmentURL)}')`,
                                    height: '266px'
                                }}
                            >

                            </div>

                    }


                    <div className="overlay-layer card-rounded bg-dark bg-opacity-25"
                        onClick={handleOpenCloseProductSelctionModal}
                    >
                        <i className="ki-duotone ki-eye fs-3x text-white">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                        </i>
                    </div>

                </a>

                <div className="m-0">

                    <a href="#" onClick={handleOpenCloseProductSelctionModal} className="text-gray-800 text-hover-primary fs-3 fw-bold d-block mb-0">
                        {makeAnyStringShortAppenDots(productItem?.productName, 20)}
                    </a>
                    <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '-5px' }}>
                        <span className="fw-bold fs-6 text-gray-500 d-block lh-1">{makeAnyStringShortAppenDots(productItem?.shortDescription, 18)}</span>

                        <div className="d-flex justify-content-center align-items-center">
                            {
                                onSale == true
                                    ?
                                    <span className="cashier-old-price text-end fw-bold fs-3">{GetDefaultCurrencySymbol()}{productItem?.price}</span>
                                    :
                                    <></>
                            }

                            <span className="text-success text-end fw-bold fs-3">

                                {GetDefaultCurrencySymbol()}{onSale == true ? productItem?.discountedPrice : productItem.price}

                            </span>

                        </div>

                    </div>


                </div>

                <div className="visitor-label-group">

                    {
                        productItem?.markAsNew == true
                            ?
                            <div className="visitor-product-label visitor-label-hot">New</div>
                            :
                            <></>
                    }

                    {
                        onSale == true
                            ?
                            <div className="visitor-product-label visitor-label-sale">On Sale</div>
                            :
                            <></>
                    }
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
