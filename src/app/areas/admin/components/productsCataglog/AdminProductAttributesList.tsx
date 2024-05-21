import React from 'react'
import { KTCardBody } from '../../../../../_poscommon/admin/helpers';
import { CommonTableActionCell } from '../../../common/components/CommonTableActionCell';
import dBEntitiesConst from '../../../../../_poscommon/common/constants/dBEntitiesConst';
import { sqlDeleteTypesConst } from '../../../../../_poscommon/common/enums/GlobalEnums';
import CommonListPagination from '../../../common/components/CommonListPagination';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';

export default function AdminProductAttributesList(props: { productMappedAttributes: any, onDeleteClick: any, handleGoToPageAttribute: any,
    pageBasicInfoAttribute: any }) {
    const { productMappedAttributes, onDeleteClick, handleGoToPageAttribute, pageBasicInfoAttribute } = props;
    return (
        <KTCardBody className='py-4'>
            <div className='table-responsive'>
                <table
                    id='kt_table_users'
                    className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                >
                    <thead>
                        <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light'>

                            <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Attribute Name</th>
                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Attribute Value</th>
                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Price Adjustment Type</th>
                            <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Price Adjustment</th>
                            <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-600 fw-bold'>

                        {
                            productMappedAttributes != undefined && productMappedAttributes.length > 0
                                ?
                                productMappedAttributes?.map((record: any) => (
                                    <tr role='row'>
                                        <td role="cell ps-3" className="">{record.displayName}</td>
                                        <td role="cell">
                                            <div className='badge badge-light fw-bolder'>{record.attributeDisplayText}</div>
                                        </td>
                                      
                                        <td role="cell" className="">{(stringIsNullOrWhiteSpace(record.priceAdjustmentType) || record.priceAdjustmentType == "1") ? "Fixed Value" : "Percentage"}</td>


                                        <td>
                                            <div className="align-items-center">
                                                <div className="ms-5">
                                                    <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.priceAdjustment}</a>
                                                </div>
                                            </div>
                                        </td>

                                        <td role="cell" className='text-end min-w-100px pe-3'>
                                            <CommonTableActionCell
                                                onEditClick={undefined}
                                                onDeleteClick={onDeleteClick}
                                                editId={0}
                                                showEditButton = {false}
                                                deleteData={{
                                                    showDeleteButton: true,
                                                    entityRowId: record.productAttributeMappingID,
                                                    entityName: dBEntitiesConst.Product_ProductAttribute_Mapping.tableName,
                                                    entityColumnName: dBEntitiesConst.Product_ProductAttribute_Mapping.primaryKeyColumnName,
                                                    sqlDeleteTypeId: sqlDeleteTypesConst.plainTableDelete,
                                                    deleteModalTitle: 'Delete Attribute',
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
                pageNo={pageBasicInfoAttribute.pageNo}
                pageSize={pageBasicInfoAttribute.pageSize}
                totalRecords={pageBasicInfoAttribute.totalRecords}
                goToPage={handleGoToPageAttribute}
            />
           

           

        </KTCardBody>
    )
}
