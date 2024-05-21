/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';
import { getAllCountriesApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';

interface CashierCashDrawerTransactionAddEditFormInterface {
    isOpen: boolean,
    closeModal: any,
    allShiftCashTransactionTypes: any,
    defaultValues: any,
    onSubmit: any
}



const CashierCashDrawerTransactionAddEditForm: React.FC<CashierCashDrawerTransactionAddEditFormInterface> = ({
    isOpen,
    closeModal,
    allShiftCashTransactionTypes,
    defaultValues,
    onSubmit
}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);


    const onSubmitCategoryForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };



    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-large-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Shift Drawer Info</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitCategoryForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                        <div className='row'>


                            <input type='hidden' id="transactionIdEditForm" {...register("transactionIdEditForm", { required: false })} />

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Cash Transaction Type </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.cashTransactionTypeId ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="cashTransactionTypeId" {...register("cashTransactionTypeId", { required: true })}
                                    >
                                        <option value=''>--Select--</option>

                                        {allShiftCashTransactionTypes?.map((item: any, index: any) => (
                                            <option key={index} value={item.cashTransactionTypeId}>
                                                {item.cashTransactionTypeName}
                                            </option>
                                        ))}


                                    </select>
                                    {errors.cashTransactionTypeId && <SiteErrorMessage errorMsg='Cash transaction type is required' />}
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Cash Drawer ID</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.cashDrawerId ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="cashDrawerId" {...register("cashDrawerId", { required: true })}

                                        placeholder="Enter cash drawer id"
                                    />
                                    {errors.cashDrawerId && <SiteErrorMessage errorMsg='Cash drawer id is required' />}
                                </div>
                            </div>


                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Order ID</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.orderId ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="orderId" {...register("orderId", { required: false })}
                                      
                                        placeholder="Enter order id"
                                    />
                                    {errors.orderId && <SiteErrorMessage errorMsg='Order ID' />}
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Amount</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.amount ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="amount" {...register("amount", { required: true })}

                                        placeholder="Enter amount"
                                    />
                                    {errors.amount && <SiteErrorMessage errorMsg='Amount is required' />}
                                </div>
                            </div>



                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Transaction Date</label>
                                    <input
                                        type="datetime-local"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.transactionDate ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="transactionDate" {...register("transactionDate", { required: true })}

                                        placeholder="Enter transaction date"
                                    />
                                    {errors.transactionDate && <SiteErrorMessage errorMsg='Transaction Date is required' />}
                                </div>
                            </div>


                        


                            <div className='col-lg-8'>
                                <div className="mb-10">
                                    <label className="form-label required ">Description</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.description ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="description" {...register("description", { required: true })}

                                        placeholder="Enter description"
                                    />
                                    {errors.description && <SiteErrorMessage errorMsg='Description is required' />}
                                </div>
                            </div>


                        </div>

                    </div>

                    <div className='admin-modal-footer'>
                        <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>

                        <button className="btn btn-danger" type='submit'>Save</button>
                    </div>
                </form>
            </div>


        </ReactModal>
    )
}

export default CashierCashDrawerTransactionAddEditForm;