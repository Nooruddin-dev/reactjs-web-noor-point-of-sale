/* eslint-disable */

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useState } from 'react';
import ReactSelect from 'react-select'
import { toAbsoluteUrl } from '../../../../../_poscommon/admin/helpers';


type TypeOrderType = {
    value: string,
    label: string | ReactElement,
    flag: string,
}


export default function VisitorServiceHeader(props: { diningOption: any, setDiningOption: any, isSearchFormVisible: any, setIsSearchFormVisible: any }) {
    const { diningOption, setDiningOption, isSearchFormVisible,  setIsSearchFormVisible} = props;


    const ordersTypesList: Array<TypeOrderType> = [
        { value: '2', label: 'Take Away', flag: 'media/svg/coins/ethereum.svg' },
        { value: '1', label: 'Dine In', flag: 'media/svg/coins/filecoin.svg' },

    ]

    const handleOrderTypeChange = (selected: any) => {
        setDiningOption(selected?.value ?? 1); // Update the state with the selected option
    };

    const toggleSearchForm = (e: any) => {
        
        e.preventDefault()
        setTimeout(() => {
            setIsSearchFormVisible(!isSearchFormVisible);
        }, 100);

    };
    

    return (
        <>
            <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack mb-4" style={{ marginTop: '-20px' }}>

                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">

                    <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">Services</h1>



                </div>



                <div className="d-flex align-items-center gap-2 gap-lg-3">



                    <div className="m-0">

                        <button className="btn btn-sm btn-flex btn-secondary fw-bold" onClick={(e) => toggleSearchForm(e)}>

                            <FontAwesomeIcon icon={faMagnifyingGlass} className=" fs-6 text-muted me-1"

                            />

                            Search

                        </button>


                    </div>

                    <div className="form-floating border border-gray-300 rounded mb-0">

                        <ReactSelect
                            className='react-select-styled'
                            classNamePrefix='react-select'
                            options={ordersTypesList.map((item: any) => {
                                item.label = (
                                    <div className='label'>
                                        <img src={toAbsoluteUrl(item.flag)} alt='flag' className='w-20px rounded-circle me-2' />
                                        <span>{item.label}</span>
                                    </div>
                                )
                                return item
                            })}
                            placeholder='Select an option'
                            defaultValue={ordersTypesList?.find(x => x.value == diningOption)}
                            onChange={handleOrderTypeChange}
                        />


                    </div>

                    {/* <a href="#" className="btn btn-sm fw-bold btn-primary" >Create</a> */}

                </div>
            </div>

      

        </>
    )
}
