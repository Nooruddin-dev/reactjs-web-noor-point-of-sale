/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { KTCardBody, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers';
import { CommonTableActionCell } from '../../../common/components/CommonTableActionCell';
import dBEntitiesConst from '../../../../../_poscommon/common/constants/dBEntitiesConst';
import { sqlDeleteTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums';
import CommonListPagination from '../../../common/components/CommonListPagination';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';
import { APP_BASIC_CONSTANTS, API_BASE_URL } from '../../../../../_poscommon/common/constants/Config';
import { getColorsListServiceApi, getProductMappedImagesListApi, updateProductImgColorMappingApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';


export default function AdminProductsMappedImages(props: { productId: any }) {
    const { productId } = props;
    const [listRefreshImages, setListRefreshImages] = useState<number>(0);
    const [imagesList, setImagesList] = useState<any>([]);
    const [colorsList, setColorsList] = useState<any>([]);
    const [selectedColors, setSelectedColors] = useState<any>([]);



    const [pageBasicInfoProductImg, setPageBasicInfoProductImg] = useState<any>(
        {
            productId: productId,
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );

    const getColorName = (colorId: any) => {
        const colorName = colorsList?.find((x: { colorId: any; }) => x.colorId == colorId)?.colorName;
        return colorName;
    }

    const getColorCode = (colorId: any) => {
        const hexCode = colorsList?.find((x: { colorId: any; }) => x.colorId == colorId)?.hexCode;
        if(hexCode && !stringIsNullOrWhiteSpace(hexCode)){
            return hexCode;
        }else{
            return '#F9F9F9';
        }
      
    }

    const SaveProductImagesColorsMapping =(event: any)=>{
        event.preventDefault();
        

        if(selectedColors == undefined || selectedColors == null || selectedColors.length == 0){
            showErrorMsg('No color selected!');
        }

        let formData = {
            productId: productId,
            productMappedColorsJson: JSON.stringify(selectedColors)
           
        }
       

        updateProductImgColorMappingApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                   

                } else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });
    }


    const handleColorChange = (productPictureMappingId: number, colorId: string) => {
        const updatedColors: any = [...selectedColors];

        var colorExists = updatedColors?.findIndex((item: { productPictureMappingId: number; }) => item.productPictureMappingId === productPictureMappingId);
    
            // If the colorid exists in the array, update its colorCode
        if (colorExists !== -1) {
            updatedColors[colorExists].colorId = colorId;
        } else {
            updatedColors.push({ productPictureMappingId, colorId });
        }

        

        setSelectedColors(updatedColors);
        console.log('colors for product image: ', selectedColors)
        
    };

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshImages(prevCounter => prevCounter + 1);
    }

    const handleGoToPageImage = (page: number) => {

        //--reset pageNo to param page value
        pageBasicInfoProductImg((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshImages(prevCounter => prevCounter + 1);
    };


    useEffect(() => {
        getProductMappedImagesListService();
        getColorsListService();
    }, [listRefreshImages]);


    const getProductMappedImagesListService = () => {

        const pageBasicInfoProductParam = new URLSearchParams(pageBasicInfoProductImg).toString();

        getProductMappedImagesListApi(pageBasicInfoProductParam)
            .then((res: any) => {

                const { data } = res;
                console.log('mapped images list: ', data);
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfoProductImg((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setImagesList(res?.data);
                }else{
                    setImagesList([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    const getColorsListService = () => {

        const pageInfoColorRequest: any = {
            PageNo: 1,
            PageSize: 300
        }
        const pageInfoColorParam = new URLSearchParams(pageInfoColorRequest).toString();

        getColorsListServiceApi(pageInfoColorParam)
            .then((res: any) => {
                const { data } = res;
                console.log('colors list: ', data);
                if (data && data.length > 0) {
                    setColorsList(res?.data);
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };
    return (


        <>

            <div className="row mb-5">
                <div className="col-lg-12">
                    <div className="d-flex justify-content-end">

                        <a href="#" className="btn btn-warning"
                        onClick={SaveProductImagesColorsMapping}
                        >
                            <i className="bi bi-chat-square-text-fill fs-4 me-2"></i>
                            Save Images/Colors Mapping
                        </a>
                    </div>
                </div>
                <div className="col-lg-12">
                    <KTCardBody className='py-4'>
                        <div className='table-responsive'>
                            <table
                                id='kt_table_users'
                                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                            >
                                <thead>
                                    <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light'>

                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Image</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Current Color</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>New Color</th>

                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        imagesList != undefined && imagesList.length > 0
                                            ?
                                            imagesList?.map((record: any) => (
                                                <tr role='row'>
                                                    <td className='ps-3'>
                                                        <div className="d-flex align-items-center">

                                                            <a href="#" className="symbol symbol-50px">
                                                                {/* <span className="symbol-label"
                                                                    style={{ backgroundImage: `${API_BASE_URL}/${record.attachmentURL}` }}
                                                                ></span> */}

                                                                <span className="symbol-label"
                                                                    style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.attachmentURL)})` }}
                                                                ></span>
                                                            </a>



                                                        </div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge  fw-bolder' style={{backgroundColor: getColorCode(record.colorId), color: '#808080'}}>{getColorName(record.colorId) ?? 'No Color'}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>
                                                            <select
                                                                className={`form-select form-select-solid`}
                                                                aria-label="Select example"

                                                                onChange={(e) => handleColorChange(record.productPictureMappingId, e.target.value)}
                                                                value={selectedColors?.find((item: { productPictureMappingId: any; }) => item.productPictureMappingId === record.productPictureMappingId)?.colorId || ''}
                                                            >
                                                                <option value=''>--Select--</option>
                                                                {colorsList?.map((item: any) => (
                                                                    <option key={item.colorId} value={item.colorId}>
                                                                        {item.colorName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>



                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={undefined}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={0}
                                                            showEditButton={false}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.productPictureMappingId,
                                                                entityName: dBEntitiesConst.ProductPicturesMapping.tableName,
                                                                entityColumnName: dBEntitiesConst.ProductPicturesMapping.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete Image',
                                                                isRawDummyRecordDelete: record?.productAttributeMappingID < 1 ? true : false

                                                            }}
                                                        />
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
                        <CommonListPagination
                            pageNo={pageBasicInfoProductImg.pageNo}
                            pageSize={pageBasicInfoProductImg.pageSize}
                            totalRecords={pageBasicInfoProductImg.totalRecords}
                            goToPage={handleGoToPageImage}
                        />




                    </KTCardBody>

                </div>
            </div>

        </>
    )
}
