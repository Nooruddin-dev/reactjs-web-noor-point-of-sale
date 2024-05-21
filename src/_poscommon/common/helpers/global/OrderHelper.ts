/* eslint-disable */

import { postCustomerOrderApi } from "../api_helpers/ApiCalls";
import { valueRoundToDecimalPlaces } from "./ConversionHelper";
import { showErrorMsg } from "./ValidationHelper";


export const calculateProductItemAdditionalPrice = (
  productAllAttributesForInventory: any,
  selectedAttributes: any
): number => {

  let additionalPrice = 0;
  selectedAttributes?.forEach((selectedAttr: any) => {
    const priceData = productAllAttributesForInventory.find(
      (attr: any) =>
        attr.productAttributeID === selectedAttr.productAttributeID &&
        attr.attributeValue === selectedAttr.primaryKeyValue
    );
    if (priceData && priceData.additionalPrice) {
      additionalPrice += priceData.additionalPrice;
    }
  });
  return additionalPrice;
};

// Define the return type of the function to ensure you get the correct data
interface UpdateResultProductQuantityType {
  updatedCartProductsData: any[]; // Updated array
  updatedCartItem?: any;           // Updated cart item for Redux
  success: boolean;
  errorMessage?: string;
}

export const updateProductQuantity = (
  cartItemsSession: any[],
  cartProductsData: any[],
  selectedProduct: any,
  clickType: string,


): UpdateResultProductQuantityType => {
  let qty = cartItemsSession.find((x) => x.productId === selectedProduct.productId)?.quantity ?? 1;
  let newValue = clickType === 'plus' ? qty + 1 : qty - 1;

  if (newValue < 1) {
    return {
      success: false,
      errorMessage: 'Quantity cannot be less than 1.',
      updatedCartProductsData: cartProductsData,
    };
  }

  if (
    selectedProduct.mainOrderMaximumQuantity &&
    newValue > selectedProduct.mainOrderMaximumQuantity
  ) {
    return {
      success: false,
      errorMessage: `Cannot add more than ${selectedProduct.mainOrderMaximumQuantity} of this product.`,
      updatedCartProductsData: cartProductsData,
    };
  }


  //--Check product stock quantity attribute based
  if (selectedProduct?.productAttributesForInventory && selectedProduct?.productAttributesForInventory.length > 0) {
    for (let index = 0; index < selectedProduct?.productAttributesForInventory.length; index++) {
      const elementAttr = selectedProduct?.productAttributesForInventory[index];
      const _productSelectedAttributes = cartItemsSession?.find(x => x.productId == selectedProduct?.productId)?.productSelectedAttributes;

      const exceedsStock = _productSelectedAttributes?.some(
        (x: any) => x.productAttributeID === elementAttr.productAttributeID && x.primaryKeyValue === elementAttr.attributeValue
      ) && (elementAttr?.stockQuantity < 1 || newValue > elementAttr.stockQuantity);

      if (exceedsStock) {

        if (elementAttr?.stockQuantity != null && elementAttr?.stockQuantity != undefined
          && elementAttr.stockQuantity < 1 && elementAttr?.isBoundToStockQuantity == true
        ) {

          return {
            success: false,
            errorMessage: `Product is out of stock for ${elementAttr.attributeName}. Can't add it in the cart!`,
            updatedCartProductsData: cartProductsData,
          };

        }

        if (elementAttr?.stockQuantity != null && elementAttr?.stockQuantity != undefined
          && newValue > elementAttr.stockQuantity && elementAttr?.isBoundToStockQuantity == true
        ) {
          return {
            success: false,
            errorMessage: `There are only ${elementAttr.stockQuantity} items left in stock for ${elementAttr?.attributeName}!`,
            updatedCartProductsData: cartProductsData,
          };
        }



      }
    }
  } else {
    if (selectedProduct?.mainStockQuantity != null && selectedProduct?.mainStockQuantity != undefined
      && selectedProduct.mainStockQuantity < 1 && selectedProduct?.mainIsBoundToStockQuantity == true
    ) {

      return {
        success: false,
        errorMessage: `Product is out of stock. Can't add it in the cart!`,
        updatedCartProductsData: cartProductsData,
      };
    }

    if (selectedProduct?.mainStockQuantity != null && selectedProduct?.mainStockQuantity != undefined
      && qty > selectedProduct.mainStockQuantity && selectedProduct?.mainIsBoundToStockQuantity == true
    ) {

      return {
        success: false,
        errorMessage: `There are only ${selectedProduct.mainStockQuantity} items left in stock for this product!`,
        updatedCartProductsData: cartProductsData,
      };
    }
  }




  if (newValue >= 50) {
    return {
      success: false,
      errorMessage: `Invalid quantity. Please select less than 50!`,
      updatedCartProductsData: cartProductsData,
    };
  }

  // Create a new cartProductsData array and update quantity
  const updatedCartProductsData = [...cartProductsData];
  const productIndex = updatedCartProductsData.findIndex((obj) => obj.productId === selectedProduct.productId);

  if (productIndex >= 0) {
    updatedCartProductsData[productIndex].quantity = newValue;
  }

  // Create the updated cart item to dispatch to Redux
  const currentCartItem = cartItemsSession.find((obj) => obj.productId === selectedProduct.productId);
  const updatedCartItem = {
    ...currentCartItem,
    quantity: newValue,
  };

  // Return updated data
  return {
    success: true,
    errorMessage: 'success',
    updatedCartProductsData,
    updatedCartItem,
  };
};

// Define the result type for the function
interface OrderResult {
  success: boolean; // Indicates whether the order placement was successful
  orderId?: number; // Optional order ID, if successful
  errorMessage?: string; // Optional error message
}

// Helper function for placing and confirming a customer order
export const placeAndConfirmCustomerOrder = (
  cartProductsData: any[], // Array of cart products
  selectedCustomerObject: any, // Selected customer object
  couponCode: string, // Coupon code (if applicable)
  defaultPaymentMethod: number, // Default payment method
  diningOption: number,
  cartSubTotal: number, // Cart subtotal
  shippingSubTotal: number, // Shipping subtotal
  orderTotal: number, // Order total
  orderBasedTaxesFinal: any, // Tax if applied on order total
  stripPaymentToken: any = "", // Stripe payment token (optional)
  payPalOrderConfirmJson: any // PayPal order confirmation JSON (optional)
): Promise<OrderResult> => {
  return new Promise((resolve, reject) => {
    try {
      const paramOrder = {
        customerId: selectedCustomerObject.busnPartnerId,
        orderNote: 'Customer Order',
        cartJsonData: JSON.stringify(cartProductsData),
        couponCode: couponCode || "",
        paymentMethod: defaultPaymentMethod,
        diningOption: diningOption,
        paymentToken: stripPaymentToken,
        payPalOrderConfirmJson: payPalOrderConfirmJson,
        cartSubTotal,
        shippingSubTotal,
        orderBasedTaxesFinal: orderBasedTaxesFinal,
        orderTotal,
      };

      postCustomerOrderApi(paramOrder)
        .then((res: any) => {
          if (
            res?.data?.response?.success === true &&
            res?.data?.response?.responseMessage === 'Saved Successfully!'
          ) {
            const orderId = parseInt(res?.data?.response?.primaryKeyValue, 10);

            resolve({
              success: true,
              orderId: orderId,
            });
          } else {
            const errorMsg = 'An error occurred. Please try again!';
            showErrorMsg(errorMsg);
            resolve({
              success: false,
              errorMessage: errorMsg,
            });
          }
        })
        .catch((err: any) => {
          const errorMsg = 'An error occurred while placing the order. Please try again!';
          console.error(err);
          showErrorMsg(errorMsg);
          resolve({
            success: false,
            errorMessage: errorMsg,
          });
        });
    } catch (err: any) {
      const errorMsg = 'An unexpected error occurred. Please try again!';
      showErrorMsg(errorMsg);
      console.error(err.message);
      resolve({
        success: false,
        errorMessage: errorMsg,
      });
    }
  });
};


interface CartTotals {
  cartSubTotal: number;
  shippingSubTotal: number;
  orderTaxesTotal: number;
  variantAdditionalChargesTotal: number;
  orderTotal: number;
}

export const calculateCartItemTotals = (
  item: any,
  additionalPrice: number,
  cartSubTotalLocal: number,
  shippingSubTotalLocal: number,
  orderTaxesTotalLocal: number,
  variantAdditionalChargesLocal: number,
  orderTotalLocal: number
): CartTotals => {
  // Calculate the basic fields
  const itemPriceTotal = valueRoundToDecimalPlaces(
    (item.discountedPrice > 0 ? item.discountedPrice : item.price) * item.quantity
  );
  const orderItemShippingChargesTotal = valueRoundToDecimalPlaces(
    (item.shippingCharges ?? 0) * item.quantity
  );
  const orderItemAttributeChargesTotal = valueRoundToDecimalPlaces(
    additionalPrice * item.quantity
  );
  const orderItemTaxTotal = valueRoundToDecimalPlaces(
    (item.productTaxValue ?? 0) * item.quantity
  );

  
  debugger
  const itemSubTotal = valueRoundToDecimalPlaces(
    itemPriceTotal + orderItemShippingChargesTotal + orderItemAttributeChargesTotal + orderItemTaxTotal
  );

  // Update item fields
  item.itemPriceTotal = itemPriceTotal;
  item.orderItemShippingChargesTotal = orderItemShippingChargesTotal;
  item.orderItemAttributeChargesTotal = orderItemAttributeChargesTotal;
  item.orderItemTaxTotal = orderItemTaxTotal;
  item.itemSubTotal = itemSubTotal;

  // Update sub-totals
  cartSubTotalLocal = valueRoundToDecimalPlaces(cartSubTotalLocal + itemPriceTotal);
  shippingSubTotalLocal = valueRoundToDecimalPlaces(shippingSubTotalLocal + orderItemShippingChargesTotal);
  orderTaxesTotalLocal = valueRoundToDecimalPlaces(orderTaxesTotalLocal + orderItemTaxTotal);
  variantAdditionalChargesLocal = valueRoundToDecimalPlaces(
    variantAdditionalChargesLocal + orderItemAttributeChargesTotal
  );
  orderTotalLocal = valueRoundToDecimalPlaces(orderTotalLocal + itemSubTotal);

  // Return the updated sub-totals
  return {
    cartSubTotal: cartSubTotalLocal,
    shippingSubTotal: shippingSubTotalLocal,
    orderTaxesTotal: orderTaxesTotalLocal,
    variantAdditionalChargesTotal: variantAdditionalChargesLocal,
    orderTotal: orderTotalLocal,
  };
};