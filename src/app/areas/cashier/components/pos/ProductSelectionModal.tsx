/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { getProductDetailForPointOfSaleByIdApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { calculatePriceDiscountPercentage, makeAnyStringShortAppenDots } from '../../../../../_poscommon/common/helpers/global/ConversionHelper';
import { showErrorMsg, showInfoMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper';
import { calculateProductItemAdditionalPrice } from '../../../../../_poscommon/common/helpers/global/OrderHelper';

interface ProductSelectionModalnterface {
    isOpen: boolean,
    closeModal: any,
    productId: number,
    handleAddToCart: any

}



const ProductSelectionModal: React.FC<ProductSelectionModalnterface> = ({
    isOpen,
    closeModal,
    productId,
    handleAddToCart
}) => {

    const [productDetail, setProductDetail] = useState<any>({});
    const [qty, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string>('media/stock/food/img-2.jpg');
    const [productImages, setProductImages] = useState<any>([]);
    const [productAllAttributesForInventory, setProductAllAttributesForInventory] = useState<any>([]);
    const [productSelectedAttributes, setProductSelectedAttributes] = useState<any>([]);
    const [productActualPrice, setProductActualPrice] = useState<number>(0.00);
    const [productDiscountedPrice, setProductDiscountedPrice] = useState<number>(0.00);
    const [onSale, setOnSale] = useState<boolean>(false);

    const attributeMainClass = 'cursor-pointer border border-gray-300 border-dashed rounded min-w-80px py-1 px-4 mx-2 mb-3';


    const handleImageClick = (imagePath: string) => {
        setSelectedImage(imagePath);
    };

    const DecreaseItem = () => {

        if (qty > 1) {
            setQuantity((qty) - 1);
        }
    }

    const IncrementItem = () => {

        if (qty + 1 > 49) {
            showErrorMsg('Invalid quantity. Please select less than 50!');
        }

        if (productDetail.mainOrderMaximumQuantity != undefined && productDetail.mainOrderMaximumQuantity != null && productDetail.mainOrderMaximumQuantity > 0) {
            if ((qty + 1) > productDetail.mainOrderMaximumQuantity) {
                showErrorMsg(`Can not add more than ${productDetail.mainOrderMaximumQuantity} for this product`);
            } else {
                setQuantity((qty) + 1);
            }
        } else {
            if (qty < 10) {
                setQuantity((qty) + 1);
            }
        }

    }

    const setProductVariantsFromPopup = (primaryKeyValue: any, productAttributeID: number) => {


        // Create a copy of the current selected attributes state
        let updatedSelectedAttributes = [...productSelectedAttributes];


        // Retrieve the selected attribute from your data source
        const attributeBasicData = productAllAttributesForInventory.find((attr: { productAttributeID: number; attributeValue: any; }) => attr.productAttributeID === productAttributeID && attr.attributeValue === primaryKeyValue);
        if (attributeBasicData) {
            if (attributeBasicData.isBoundToStockQuantity == true && attributeBasicData.stockQuantity < 1) {
                showErrorMsg("This variant is out of stock!");
                return false;
            }
        }

        // Check if the attribute already exists in the state
        const existingIndex = updatedSelectedAttributes.findIndex(attr => attr.productAttributeID === productAttributeID);


        //--If attribute already exists then just update its value
        if (existingIndex >= 0) {

            // Check if the same attribute was clicked again (same primary key value)
            const sameAttributeClicked = updatedSelectedAttributes[existingIndex].primaryKeyValue === primaryKeyValue;
            if (sameAttributeClicked) {
                // Remove the attribute from the list if the same attribute was clicked again
                updatedSelectedAttributes.splice(existingIndex, 1);
            } else {
                // Update the primary key value if the same attribute was not clicked again
                updatedSelectedAttributes[existingIndex].primaryKeyValue = primaryKeyValue;
            }



        } else {
            updatedSelectedAttributes.push({
                productId: productId,
                productAttributeID: productAttributeID,
                primaryKeyValue: primaryKeyValue,

            });
        }

        //--Set in product selected attributes
        setProductSelectedAttributes(updatedSelectedAttributes);

        const additionalPrice = calculateProductItemAdditionalPrice(
            productAllAttributesForInventory,
            updatedSelectedAttributes
        );

        //--Set any extra price if associated with this attribute
        // let additionalPrice = 0;
        // updatedSelectedAttributes.forEach(selectedAttr => {
        //     const priceData = productAllAttributesForInventory.find((attr: { productAttributeID: any; attributeValue: any; }) => attr.productAttributeID === selectedAttr.productAttributeID
        //         && attr.attributeValue === selectedAttr.primaryKeyValue);
        //     if (priceData && priceData.additionalPrice) {
        //         additionalPrice += priceData.additionalPrice;
        //     }
        // });


        //--Set product actual price
        setProductActualPrice((productDetail.price + additionalPrice));

        //--Set product discounted price

        setProductDiscountedPrice((productDetail.discountedPrice + additionalPrice));

        //--Set Product images according to product color
        // if (ProductAttributeID == Config.PRODUCT_ATTRIBUTE_ENUM['Color']) {
        //     mappedProductImagesWithColor(primaryKeyValue);
        // }

        console.log('Temp Attributes', updatedSelectedAttributes);
        console.log('product selected attributes', productSelectedAttributes);
    }

    const HandleAddToCart = (e: any) => {
        e.preventDefault()
        if (productDetail == undefined || productDetail.productId == undefined || productDetail.productId < 1) {
            showErrorMsg("Invalid product!");
            return false;
        }





        //--validate if no attribute selected
        if (productAllAttributesForInventory != null && productAllAttributesForInventory.length > 0) {
            for (let index = 0; index < productAllAttributesForInventory.length; index++) {
                const elementAttr = productAllAttributesForInventory[index];
                if (!productSelectedAttributes.some((x: { productAttributeID: any; }) => x.productAttributeID == elementAttr.productAttributeID)) {
                    showInfoMsg("Please select " + elementAttr.attributeDisplayName + " variant!");
                    return false;
                }
            }
        }


        //--Check product stock quantity attribute based
        if (productAllAttributesForInventory != null && productAllAttributesForInventory.length > 0) {
            for (let index = 0; index < productAllAttributesForInventory.length; index++) {
                const elementAttr = productAllAttributesForInventory[index];
                if (productSelectedAttributes.some((x: { productAttributeID: any; primaryKeyValue: any; }) => x.productAttributeID == elementAttr.productAttributeID && x.primaryKeyValue == elementAttr.attributeValue)) {

                    if (elementAttr?.stockQuantity != null && elementAttr?.stockQuantity != undefined
                        && elementAttr.stockQuantity < 1 && elementAttr?.isBoundToStockQuantity == true
                    ) {
                        showInfoMsg(`Product is out of stock for ${elementAttr.attributeName}. Can't add it in the cart!`);
                        return false;
                    }

                    if (elementAttr?.stockQuantity != null && elementAttr?.stockQuantity != undefined
                        && qty > elementAttr.stockQuantity && elementAttr?.isBoundToStockQuantity == true
                    ) {
                        showInfoMsg(`There are only ${elementAttr.stockQuantity} items left in stock for ${elementAttr?.attributeName}!`);
                        return false;
                    }



                }
            }
        } else {
            if (productDetail?.mainStockQuantity != null && productDetail?.mainStockQuantity != undefined
                && productDetail.mainStockQuantity < 1 && productDetail?.mainIsBoundToStockQuantity == true
            ) {
                showInfoMsg("Product is out of stock. Can't add it in the cart!");
                return false;
            }

            if (productDetail?.mainStockQuantity != null && productDetail?.mainStockQuantity != undefined
                && qty > productDetail.mainStockQuantity && productDetail?.mainIsBoundToStockQuantity == true
            ) {
                showInfoMsg(`There are only ${productDetail.mainStockQuantity} items left in stock for this product!`);
                return false;
            }
        }






        //--check if quantity selected
        if (qty == undefined || qty < 1) {
            showInfoMsg("Select quantity!");
            return false;
        }

        let defaultImage = selectedImage;
        let cartItems = handleAddToCart(productId, qty, productSelectedAttributes, defaultImage);


        // dispatch(rootAction.cartAction.setCustomerCart(cartItems));
        // dispatch(rootAction.cartAction.SetTotalCartItems(JSON.parse(cartItems).length));

        closeModal();
    }

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };



    useEffect(() => {
        getProductDetailForPointOfSaleByIdService();
    }, [productId]);

    //--Set some varaibles when productDetail changed
    useEffect(() => {

        setProductActualPrice(productDetail?.price);
        setProductDiscountedPrice((productDetail.discountedPrice));
        setOnSale(productDetail?.discountedPrice != undefined && productDetail.discountedPrice != null && productDetail.discountedPrice > 0 ? true : false);
        console.log('on sale: ', onSale);
    }, [productDetail]);


    const getProductDetailForPointOfSaleByIdService = () => {

        getProductDetailForPointOfSaleByIdApi(productId)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    setProductDetail(res?.data);

                    const { productImagesList, productAttributesForInventory } = res?.data;
                    if (productImagesList && productImagesList != null && productImagesList.length > 0) {
                        setProductImages(productImagesList);
                        //--set default main image
                        setSelectedImage(productImagesList[0]?.attachmentURL);
                    }

                    if (productAttributesForInventory && productAttributesForInventory != null && productAttributesForInventory.length > 0) {
                        setProductAllAttributesForInventory(productAttributesForInventory);

                    }

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


            <div className='cashier-modal-area'>
                {/* <div className='cashier-modal-header'>
                    <h2>Create/Update Color</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div> */}

                <div className='modal-body py-lg-5 px-lg-5 cashier-modal-height'>

                    <div className='row'>

                        <div className="col-lg-5">
                            <div className="cashier-main-image">
                                <img
                                    className='rounded-3 mb-4 h-350px  h-xxl-350px'
                                    src={toAbsoluteUrlCustom(selectedImage)}
                                    style={{ width: '98%' }}
                                />
                            </div>
                            <div className="cashier-image-slider">
                                {
                                    productImages && productImages.length > 0
                                        ?
                                        <Slider {...settings}>
                                            {productImages?.map((item: any, index: any) => (
                                                <div className='' key={index} onClick={() => handleImageClick(item.attachmentURL)}>
                                                    <img className='cursor-pointer rounded-3 mb-4  h-100px  h-xxl-100px'
                                                        style={{ width: '85%', marginRight: '5px !important' }}
                                                        src={toAbsoluteUrlCustom(item.attachmentURL)} />
                                                </div>
                                            ))}
                                        </Slider>
                                        :
                                        <></>
                                }

                            </div>
                        </div>
                        <div className="col-lg-7 cashier-select-modal-product">
                            <div className='m-4'>
                                <div className="d-flex justify-content-between mt-4">
                                    <div>
                                        <div className="mb-2">

                                            <div className="text-left">
                                                <span className="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-1 fs-xl-1"

                                                >{makeAnyStringShortAppenDots(productDetail.productName, 80)}</span>
                                                <span className="text-gray-500 fw-semibold d-block fs-4 mt-1">{makeAnyStringShortAppenDots(productDetail.shortDescription, 100)}</span>
                                            </div>

                                        </div>

                                        <div className='d-flex align-items-center'>
                                            {
                                                onSale == true
                                                    ?
                                                    <>
                                                        <span className="cashier-old-price fw-bold fs-1">{GetDefaultCurrencySymbol()}{productActualPrice}</span>
                                                        <span className="text-success text-end fw-bold fs-1 me-2">{GetDefaultCurrencySymbol()}{`${productDiscountedPrice}`}</span>
                                                        {/* <span className="text-danger text-end fw-bold fs-4">(-{calculatePriceDiscountPercentage(productActualPrice, productDiscountedPrice)})</span> */}

                                                    </>

                                                    :
                                                    <span className="text-success text-end fw-bold fs-1">{`${productActualPrice}`}</span>
                                            }

                                           



                                          
                                        </div>

                                    </div>
                                    <div>
                                        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                                            <KTIcon className='fs-1' iconName='cross' />
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex align-items-center mt-6 mb-6 gap-1">
                                    <button className="cursor-pointer btn btn-sm btn-outline-secondary fw-bold fs-3 cashier-btn-add-cart px-2 py-1" onClick={DecreaseItem}>  <i className="ki-duotone ki-minus fs-2x"></i></button>
                                    <span className="mx-2 fw-bold fs-3">{qty}</span>
                                    <button className="cursor-pointer btn btn-sm btn-outline-secondary fw-bold fs-3 cashier-btn-add-cart px-2 py-1" onClick={IncrementItem}>  <i className="ki-duotone ki-plus fs-2x"></i></button>
                                </div>

                                <div className='d-block mb-3'>
                                    {
                                        !stringIsNullOrWhiteSpace(productDetail?.sku)
                                            ?
                                            <div>
                                                <a className='text-gray-800 text-hover-primary fw-bold me-2'>SKU: <span className='fw-semibold text-gray-500'>{productDetail.sku}</span></a>
                                            </div>
                                            :
                                            <></>
                                    }

                                    <div className='mt-1'>
                                        <a className='text-gray-800 text-hover-primary fw-bold me-2'>Vendor: <span className='fw-semibold text-gray-500'>{productDetail.vendorName}</span></a>
                                    </div>

                                </div>

                                <div className="separator"></div>

                                <div className='mt-4 mb-4' style={{ overflowY: 'auto', maxHeight: '250px' }}>


                                    {(() => {
                                        let attributeNames = productAllAttributesForInventory?.map(({ productAttributeID, attributeDisplayName }: { productAttributeID: number, attributeDisplayName: string }) => ({ productAttributeID, attributeDisplayName }));
                                        let uniqueAttributeNames = productAllAttributesForInventory?.reduce((uniqueAttributes: any[], { productAttributeID, attributeDisplayName }: { productAttributeID: number, attributeDisplayName: string }) => {
                                            // Check if the attribute with the same productAttributeID exists
                                            const existingAttribute = uniqueAttributes.find(attr => attr.productAttributeID === productAttributeID);

                                            // If not found, add it to the uniqueAttributes array
                                            if (!existingAttribute) {
                                                uniqueAttributes.push({ productAttributeID, attributeDisplayName });
                                            }

                                            return uniqueAttributes;
                                        }, []);

                                        // let uniqueAttributeNames = [...new Map(attributeNames.map((item) => [item["ProductAttributeID"], item])).values(),];

                                        return (
                                            uniqueAttributeNames?.map((atrItem: any, atrIdx: any) =>

                                                <div>


                                                    <a href="#" className="text-gray-800 text-hover-primary fw-bold me-2"> {atrItem.attributeDisplayName}</a>
                                                    <div className="d-flex flex-start  flex-wrap mt-3">
                                                        {(() => {
                                                            let RowData = productAllAttributesForInventory?.filter((x: { productAttributeID: any; }) => x.productAttributeID == atrItem.productAttributeID)

                                                            return (
                                                                RowData?.map((rowItem: any, rowIdx: any) =>

                                                                    <>


                                                                        <a href='#'
                                                                            className={`${attributeMainClass} ${productSelectedAttributes.some((x: { productAttributeID: any; primaryKeyValue: any; }) => x.productAttributeID == atrItem.productAttributeID && x.primaryKeyValue == rowItem.attributeValue) ? ' btn border-active-primary btn-active-light-primary active border-2' : ''}`}
                                                                            onClick={(e) => setProductVariantsFromPopup(rowItem.attributeValue, rowItem.productAttributeID)}

                                                                        >

                                                                            <div
                                                                                className="fw-semibold text-gray-500"
                                                                            // style={rowItem.attributeName == 'Colors' ? { color: '#FF0000 !important' } : {}}
                                                                            >
                                                                                {rowItem?.attributeValueDisplayText}


                                                                            </div>

                                                                            <div className="fs-6 fw-bold text-gray-700">
                                                                                {

                                                                                    rowItem.additionalPrice != undefined && rowItem.additionalPrice > 0 ?
                                                                                        `+${GetDefaultCurrencySymbol()}${rowItem.additionalPrice}`
                                                                                        :
                                                                                        <></>

                                                                                }
                                                                            </div>
                                                                        </a>
                                                                    </>
                                                                )
                                                            );
                                                        })()}


                                                    </div>
                                                </div>
                                            )

                                        );


                                    })()}


                                    {/* <div>
                                        <a href="#" className="text-gray-800 text-hover-primary fw-bold me-2"> Size:</a>
                                        <div className="d-flex flex-start  flex-wrap mt-3">

                                            <div className="cursor-pointer border border-gray-300 border-dashed rounded min-w-80px py-1 px-4 mx-2 mb-3">

                                                <div className="fw-semibold text-gray-500">Small</div>
                                                <div className="fs-6 fw-bold text-gray-700">+5</div>
                                            </div>

                                         
                                            <div className="cursor-pointer border border-gray-300 border-dashed rounded min-w-80px py-1 px-4 mx-2 mb-3 btn border-active-primary btn-active-light-primary active border-2 ">

                                                <div className="fw-semibold text-gray-500">Medium</div>
                                                <div className="fs-6 fw-bold text-gray-700">+8</div>
                                            </div>

                                         


                                        </div>
                                    </div> */}

                                </div>

                                <div className="separator"></div>

                                <div className="d-flex mt-6 mb-3 justify-content-end align-items-end float-end gap-1">

                                    <button onClick={closeModal} className="btn btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger">Cancel</button>

                                    <button onClick={(e) => HandleAddToCart(e)} className="btn btn-success"><FontAwesomeIcon icon={faCartPlus} className='mr-5' /> Add to Cart</button>
                                </div>

                            </div>
                        </div>


                    </div>

                </div>

                {/* <div className='cashier-modal-footer'>
                    <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>

                    <button className="btn btn-danger" type='submit'>Save</button>
                </div> */}

            </div>


        </ReactModal>
    )
}
export default ProductSelectionModal;
