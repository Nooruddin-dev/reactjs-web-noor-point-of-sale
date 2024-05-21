/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';
import { getAllCountriesApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import { stringIsNullOrWhiteSpace } from '../../../../../_poscommon/common/helpers/global/ValidationHelper';

interface CashierShiftMasterAddEditFormInterface {
    isOpen: boolean,
    closeModal: any,
    allShiftNames: any
    allReconciliationStatuses: any,
    defaultValues: any,
    onSubmit: any
}



const CashierShiftMasterAddEditForm: React.FC<CashierShiftMasterAddEditFormInterface> = ({
    isOpen,
    closeModal,
    allShiftNames,
    allReconciliationStatuses,
    defaultValues,
    onSubmit
}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isShiftEndDateFieldEnabled, setIsShiftEndDateFieldEnabled] = useState<boolean>(stringIsNullOrWhiteSpace(defaultValues?.shiftEndedAt) == false ? true : false);


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


                            <input type='hidden' id="shiftCashDrawerIdEditForm" {...register("shiftCashDrawerIdEditForm", { required: false })} />
                            <input type='hidden' id="shiftId" {...register("shiftId", { required: false })} />
                           
                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Shift Name </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.shiftNameId ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="shiftNameId" {...register("shiftNameId", { required: true })}
                                    >
                                        <option value=''>--Select--</option>

                                        {allShiftNames?.map((item: any, index: any) => (
                                            <option key={index} value={item.shiftNameId}>
                                                {item.shiftName}
                                            </option>
                                        ))}


                                    </select>
                                    {errors.shiftNameId && <SiteErrorMessage errorMsg='Shift name is required' />}
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Shift Started At</label>
                                    <input
                                        type="datetime-local"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.shiftStartedAt ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="shiftStartedAt" {...register("shiftStartedAt", { required: true })}

                                        placeholder="Enter start date"
                                    />
                                    {errors.shiftStartedAt && <SiteErrorMessage errorMsg='Shift started time is required' />}
                                </div>
                            </div>

                            <div className='col-lg-4' style={{display: defaultValues == null ? 'none' : 'block'}}>
                                <div className="mb-10">
                                    <label className="form-label ">Shift End At</label>
                                    <input
                                        type="datetime-local"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.shiftEndedAt ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="shiftEndedAt" {...register("shiftEndedAt", { required: false })}

                                        placeholder="Enter end date"
                                        readOnly={isShiftEndDateFieldEnabled}
                                    />
                                    {errors.shiftEndedAt && <SiteErrorMessage errorMsg='Shift end time is required' />}
                                    {isShiftEndDateFieldEnabled == true && <SiteErrorMessage errorMsg='(Shift Ended. Not allowed to change this date)' />}
                                 
                                </div>
                            </div>




                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Starting Cash</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.startingCash ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="startingCash" {...register("startingCash", { required: true })}

                                        placeholder="Enter starting cash"
                                    />
                                    {errors.startingCash && <SiteErrorMessage errorMsg='Starting cash is required' />}
                                </div>
                            </div>


                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Ending Cash</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.endingCash ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="endingCash" {...register("endingCash", { required: false })}

                                        placeholder="Enter ending cash"
                                    />
                                    {errors.endingCash && <SiteErrorMessage errorMsg='Ending cash is required' />}
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Reconciliation Status </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.reconciliationStatusId ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="reconciliationStatusId" {...register("reconciliationStatusId", { required: true })}
                                    >
                                        <option value=''>--Select--</option>
                                        {allReconciliationStatuses?.map((item: any, index: any) => (
                                            <option key={index} value={item.reconciliationStatusId}>
                                                {item.reconciliationStatusName}
                                            </option>
                                        ))}



                                    </select>
                                    {errors.reconciliationStatusId && <SiteErrorMessage errorMsg='Reconciliation status is required' />}
                                </div>
                            </div>



                            <div className='col-lg-8'>
                                <div className="mb-10">
                                    <label className="form-label required ">Reconciliation Comment</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.reconciliationComments ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="reconciliationComments" {...register("reconciliationComments", { required: true })}

                                        placeholder="Enter reconciliation Comment"
                                    />
                                    {errors.reconciliationComments && <SiteErrorMessage errorMsg='Reconciliation comment is required' />}
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

export default CashierShiftMasterAddEditForm;