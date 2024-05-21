/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'
import { getTaxRulesApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { isNotEmpty } from '../../../../../_poscommon/admin/helpers';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';

export default function OrderPosSubTotal(props: {
    CartSubTotal: number, ShippingSubTotal: number, orderTaxesTotal: number, variantAdditionalChargesTotal: number,
    OrderTotal: number, selectedTaxObjectForOrder: any, setSelectedTaxObjectForOrder: any, area: string
}) {
    const { CartSubTotal, ShippingSubTotal, orderTaxesTotal, variantAdditionalChargesTotal, OrderTotal,
        selectedTaxObjectForOrder, setSelectedTaxObjectForOrder, area } = props;

    const [allTaxRules, setAllTaxRules] = useState<any>([])


    const handleSelectedTaxObjectForOrder = (taxRuleId: string) => {
        if (taxRuleId == '-999') {
            setSelectedTaxObjectForOrder({});
        } else {
            setSelectedTaxObjectForOrder(allTaxRules?.find((x: { taxRuleId: string; }) => x.taxRuleId == taxRuleId) ?? {});
        }

    }

    const calculateTaxAmountForTaxRate = (taxRate: number) => {
        let taxAmountOnOrderTotal = (CartSubTotal ?? 0) * ((taxRate ?? 0) / 100);
        if (!stringIsNullOrWhiteSpace(taxAmountOnOrderTotal)) {
            return taxAmountOnOrderTotal.toFixed(2);
        } else {
            return 0;
        }

    }

    useEffect(() => {
        getTaxRulesService();
    }, []);

    const getTaxRulesService = () => {

        const pageBasicInfoTax: any = {
            PageNo: 1,
            PageSize: 20,
            taxRuleType: 'For Order'
        }
        let pageBasicInfoTaxParams = new URLSearchParams(pageBasicInfoTax).toString();


        getTaxRulesApi(pageBasicInfoTaxParams)
            .then((res: any) => {
                let { data } = res;
                if (data && data.length > 0) {


                    setAllTaxRules(res?.data);

                } else {
                    setAllTaxRules([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        <div className="d-flex flex-stack bg-success rounded-3 p-6 mb-1">

            <div className="fs-6 fw-bold text-white">
                <span className="d-block lh-1 mb-2">Subtotal</span>
                {/* <span className="d-block mb-2">Discounts</span> */}
                <span className="d-block mb-2">Shipping</span>
                <span className="d-block mb-9">Variant Additional</span>
                <span className="d-block mb-2">Taxes Products Level</span>
                {
                    area == 'cashier'
                        ?
                        <span className="d-block mb-4 mt-4">Taxes Order</span>
                        :
                        <></>
                }

                <span className="d-block fs-2qx lh-1">Total</span>
            </div>



            <div className="fs-6 fw-bold text-white text-end">
                <span className="d-block lh-1 mb-2" data-kt-pos-element="total">{GetDefaultCurrencySymbol()}{CartSubTotal}</span>
                {/* <span className="d-block mb-2" data-kt-pos-element="discount">-$8.00</span> */}
                <span className="d-block mb-2" data-kt-pos-element="discount">{GetDefaultCurrencySymbol()}{ShippingSubTotal}</span>
                <span className="d-block mb-9" data-kt-pos-element="tax">{GetDefaultCurrencySymbol()}{variantAdditionalChargesTotal}</span>
                <span className="d-block mb-2" data-kt-pos-element="tax">{GetDefaultCurrencySymbol()}{orderTaxesTotal}</span>

                {
                    area == 'cashier'
                        ?
                        <span className="d-block mb-4 mt-4" data-kt-pos-element="tax">
                            <div className='form-group' >

                                <select
                                    className={`form-select form-select-solid`}
                                    aria-label="Select example"
                                    id="orderRelatedTaxId"
                                    style={{ height: '40px', width: '200px' }}
                                    onChange={(e) => handleSelectedTaxObjectForOrder(e.target.value)}
                                >
                                    <option value='-999'>--Select--</option>

                                    {allTaxRules?.map((item: any, index: any) => (
                                        <option key={index} value={item.taxRuleId}>
                                            {item.categoryName} {`(${GetDefaultCurrencySymbol()}${calculateTaxAmountForTaxRate(item.taxRate)})`}
                                        </option>
                                    ))}

                                </select>
                            </div>

                        </span>
                        :
                        <></>
                }




                <span className="d-block fs-2qx lh-1" data-kt-pos-element="grant-total">{GetDefaultCurrencySymbol()}{OrderTotal?.toFixed(2)}</span>
            </div>

        </div>

    )
}
