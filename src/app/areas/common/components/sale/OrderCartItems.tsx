/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import { makeAnyStringShortAppenDots, valueRoundToDecimalPlaces } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';

export default function OrderCartItems(props: {cartProductsData: any, getProductMainImage: any, removeProductFromCart: any, handleQtyChange: any, 
    createCartQuantity: any}) {
    const {cartProductsData, getProductMainImage, removeProductFromCart, handleQtyChange, createCartQuantity} = props;

    const [cartProductsDataLocal, setCartProductsDataLocal] = useState<any>([]);

    useEffect(() => {
        if (cartProductsData && cartProductsData.length > 0) {
            setCartProductsDataLocal([...cartProductsData]);
        }else{
            setCartProductsDataLocal([]);
        }
    }, [cartProductsData])

    return (
        <div className="table-responsive mb-8">

            <table className="table align-middle gs-0 gy-4 my-0">

                <thead>
                    <tr>
                        <th className="min-w-175px"></th>
                        <th className="w-125px"></th>
                        <th className="w-60px"></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        cartProductsDataLocal != undefined && cartProductsDataLocal.length > 0
                            ?
                            cartProductsDataLocal?.map((record: any, index: number) => (
                                <tr key={index}>
                                    <td className="pe-0 w-100">


                                        <div className="row align-items-center">
                                            <div className="col-lg-2 col-md-2 col-sm-3 col-3">
                                                <img src={toAbsoluteUrlCustom(getProductMainImage(record?.productImagesJson))} className="w-50px h-50px rounded-3 me-3 mb-3" alt="" />
                                            </div>

                                            <div className="col-lg-10 col-md-10 col-sm-9 col-9">
                                                <div className="d-flex justify-content-between">
                                                    <span className="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-6 me-1">{makeAnyStringShortAppenDots(record?.productName, 27)}</span>
                                                    <div className="">
                                                        <span className="fw-bold text-primary fs-3" data-kt-pos-element="item-total">

                                                            {record.discountedPrice != undefined && record.discountedPrice > 0 ?
                                                                <>
                                                                    <del style={{ color: "#9494b9" }}>{GetDefaultCurrencySymbol()}{record.price}</del> &nbsp; {GetDefaultCurrencySymbol()}{record.discountedPrice}
                                                                </>
                                                                :
                                                                <>
                                                                    {GetDefaultCurrencySymbol()}{valueRoundToDecimalPlaces(record.itemPriceTotal)}
                                                                </>

                                                            }

                                                        </span>
                                                    </div>
                                                </div>


                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="position-relative d-flex align-items-center" data-kt-dialer="true" data-kt-dialer-min="1" data-kt-dialer-max="10" data-kt-dialer-step="1" data-kt-dialer-decimals="0">

                                                        <button type="button" className="btn btn-icon btn-sm btn-light btn-icon-gray-500" data-kt-dialer-control="decrease" onClick={(e) => handleQtyChange(e, record, 'minus')}>
                                                            <i className="ki-duotone ki-minus fs-2x"></i>
                                                        </button>

                                                        <input type="text" className="form-control border-0 text-center px-0 fs-5 fw-bold text-gray-800 w-30px" data-kt-dialer-control="input" placeholder="Amount" name="manageBudget" readOnly={true} value={createCartQuantity(record?.productId)} />

                                                        <button type="button" className="btn btn-icon btn-sm btn-light btn-icon-gray-500" data-kt-dialer-control="increase" onClick={(e) => handleQtyChange(e, record, 'plus')}>
                                                            <i className="ki-duotone ki-plus fs-2x"></i>
                                                        </button>

                                                    </div>

                                                    <a href="#" className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                        onClick={(e) => removeProductFromCart(e, record?.productId)}
                                                    >
                                                        <i className="ki-duotone ki-trash fs-2">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                            <span className="path4"></span>
                                                            <span className="path5"></span>
                                                        </i>
                                                    </a>

                                                </div>

                                            </div>
                                        </div>



                                    </td>

                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan={20}>
                                    <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                        No product in the cart
                                    </div>
                                </td>
                            </tr>

                    }



                </tbody>
            </table>

        </div>
    )
}
