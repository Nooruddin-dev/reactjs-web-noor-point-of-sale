import React, { useEffect, useState } from 'react'
import { toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'


export default function PosCategoriesBox(props: { allCategories: any, activeCategoryId:number, handleCategoryClick: any }) {
    const { allCategories, activeCategoryId,  handleCategoryClick } = props;


    return (
        <ul className="nav nav-pills nav-pills-custom gap-3 mb-6" style={{ display: 'block' }}>
            {
                // add 'show active' class for the active category only
                allCategories != undefined && allCategories.length > 0
                    ?
                    allCategories?.map((record: any) => (
                        <li className="nav-item mb-3 me-0">
                            <a
                                className={`nav-link nav-link-border-solid btn btn-outline btn-flex btn-active-color-primary flex-column flex-stack pt-9 pb-7 page-bg ${activeCategoryId == record.categoryId ? 'active' : ''}`}
                                style={{ width: '138px', height: '180px' }}
                                onClick={() => handleCategoryClick(record.categoryId)}
                            >
                                <div className="nav-icon mb-3">
                                    <img src={toAbsoluteUrlCustom(record?.categoryImagePath)} className="w-50px" alt="" />
                                </div>
                                <div className="">
                                    <span className="text-gray-800 fw-bold fs-2 d-block">{record?.categoryName}</span>
                                    <span className="text-gray-500 fw-semibold fs-7">{record?.totalProducts} {record?.categoryName}</span>
                                </div>
                            </a>
                        </li>
                    ))
                    :
                    <></>

            }

        </ul>
    )
}
