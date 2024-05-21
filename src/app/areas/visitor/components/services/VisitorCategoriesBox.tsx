import React from 'react'
import { toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../../_poscommon/admin/helpers'

export default function VisitorCategoriesBox(props: { allCategories: any, activeCategoryId: number, handleCategoryClick: any }) {
    const { allCategories, activeCategoryId, handleCategoryClick } = props;

    return (
        <div className={`card card-xl-stretch mb-xl-8 mt-2 `}>

            <div className='card-header border-0 py-5 justify-content-center'>


                <h3 className='card-title align-items-start flex-column'>
                    <span className='fw-bolder text-gray-900 fs-3'>Categories</span>

                </h3>


            </div>



            <div className='card-body p-0 pt-3 d-flex flex-column'>

                <div className='visitor-pos-categories'>
                    <ul className="nav nav-pills nav-pills-custom gap-3 mb-6 d-flex justify-content-center align-items-center">

                        {
                            // add 'show active' class for the active category only
                            allCategories != undefined && allCategories.length > 0
                                ?
                                allCategories?.map((record: any, index: any) => (
                                    <li className="nav-item mb-3 me-0" key={index}>
                                        <a
                                            className={`nav-link nav-link-border-solid btn btn-outline btn-flex btn-active-color-primary flex-column flex-stack pt-6 pb-7 page-bg ${activeCategoryId == record.categoryId ? 'active' : ''}`}
                                            style={{ width: '124px', height: '133px' }}
                                            onClick={() => handleCategoryClick(record.categoryId)}
                                        >
                                            <div className="nav-icon mb-3">
                                                <img src={toAbsoluteUrlCustom(record?.categoryImagePath)} className="w-50px" alt="" />
                                            </div>
                                            <div className="">
                                                <span className="text-gray-800 fw-bold fs-4 d-block">{record?.categoryName}</span>

                                            </div>
                                        </a>
                                    </li>
                                ))
                                :
                                <><h3>No category found</h3></>

                        }


                    </ul>
                </div>


            </div>

        </div>
    )
}
