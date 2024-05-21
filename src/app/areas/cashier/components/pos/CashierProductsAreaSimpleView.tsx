/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { KTIcon, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'
import { showErrorMsg, showInfoMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../globalStore/rootReducer';
import { addItemToCartRedux } from '../../../../globalStore/features/cartItem/cartItemsSlice';

export default function CashierProductsAreaSimpleView(props: { allProducts: any }) {
    const dispatch = useDispatch();
    const { allProducts } = props;
    const [products, setProducts] = useState<any>([]);
    const cartItemsSession = useSelector((state: RootState) => state.cartItems.cartItems);


    const getRandomClass = () => {
        const classes = ['bg-primary', 'bg-danger', 'bg-success', 'bg-warning', 'bg-info'];
        const randomIndex = Math.floor(Math.random() * classes.length);
        return classes[randomIndex];
    };

    const getProductDefaultImg = (productImagesJson: string) => {
        const productImages = JSON.parse(productImagesJson ?? '[]');

        return productImages[0]?.AttachmentURL ?? '';
    };



    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], quantity: newQuantity };
        setProducts(updatedProducts);
    };

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


    const HandleAddToCart = (productId: number) => {

        if (productId == undefined || productId < 1) {
            showErrorMsg("Invalid product!");
            return false;
        }

        const productDetail = products.find((x: { productId: number; }) => x.productId == productId);
        if (productDetail && productDetail.productId == undefined || productDetail.productId < 1) {
            showErrorMsg("Invalid product!");
            return false;
        }


        //--check if quantity selected
        if (productDetail.quantity == undefined || productDetail.quantity < 1) {
            showInfoMsg("Select quantity!");
            return false;
        }

        let defaultImage = getProductDefaultImg(productDetail.productImagesJson);
        let cartItems = addProductToCart(productId, productDetail.quantity, [], defaultImage);


    }

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            setProducts([...allProducts]);
        }
    }, [allProducts])


    return (
        <>

            <div className='table-responsive'>

                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>

                    <thead>
                        <tr className='fw-bold text-muted'>

                            <th className='min-w-150px'>Product</th>
                            <th className='min-w-140px'>Price</th>
                            <th className='min-w-120px'>Category</th>
                            <th className='min-w-50px'>Quantity</th>
                            <th className='min-w-100px text-end'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            products != undefined && products.length > 0
                                ?
                                products?.map((productItem: any, index: number) => (
                                    <tr key={index}>

                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <div className='symbol symbol-45px me-5'>
                                                    {
                                                        stringIsNullOrWhiteSpace(getProductDefaultImg(productItem.productImagesJson))
                                                            ?
                                                            <img src={toAbsoluteUrl('media/stock/food/img-3.jpg')} alt='' />
                                                            :
                                                            <img src={toAbsoluteUrlCustom(getProductDefaultImg(productItem.productImagesJson))} alt='' />

                                                    }

                                                </div>
                                                <div className='d-flex justify-content-start flex-column'>
                                                    <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                        {makeAnyStringShortAppenDots(productItem?.productName, 20)}
                                                    </a>
                                                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                        {productItem.manufacturerFirstName}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>
                                                {productItem?.discountedPrice != undefined && productItem?.discountedPrice > 0 ? productItem?.discountedPrice : productItem?.price}
                                            </a>
                                            {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                Web, UI/UX Design
                            </span> */}
                                        </td>
                                        <td className='text-end'>
                                            <div className='d-flex flex-column w-100 me-2'>
                                                <div className='d-flex flex-stack mb-2'>
                                                    <span className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>   {makeAnyStringShortAppenDots(productItem?.categoryName, 20)}</span>
                                                </div>
                                                <div className='progress h-6px w-100'>
                                                    <div
                                                        className={`progress-bar ${getRandomClass()}`}
                                                        role='progressbar'
                                                        style={{ width: '100%' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-end '>
                                            <input
                                                className='form-select form-select-solid '
                                                type="number"
                                                min={0}
                                                value={productItem.quantity || 0}
                                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}

                                            />
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-end flex-shrink-0'>
                                                {/* <a
                                href='#'
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            >
                                <KTIcon iconName='switch' className='fs-3' />
                            </a> */}

                                                <a onClick={() => HandleAddToCart(productItem.productId)}
                                                    className="btn btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger"
                                                >Add to Cart</a>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                                :
                                <><h3>No product found</h3></>
                        }







                    </tbody>
                </table>

            </div>


        </>
    )
}
