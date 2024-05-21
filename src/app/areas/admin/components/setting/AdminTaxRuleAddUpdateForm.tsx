import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';

interface AdminTaxRuleAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    allTaxCategories: any,
    allCountries: any,
    onSubmit: any
}



const AdminTaxRuleAddUpdateForm: React.FC<AdminTaxRuleAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    allTaxCategories,
    allCountries,
    onSubmit
}) => {


    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmitTaxRuleForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-medium-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Create/Update Tax Rule</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitTaxRuleForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10'>

                        <div className='row'>


                            <input type='hidden' id="taxRuleIdEditForm" {...register("taxRuleIdEditForm", { required: false })} />

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Tax Category </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.taxCategoryId ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="taxCategoryId" {...register("taxCategoryId", { required: false })}
                                    >
                                        <option value=''>--Select--</option>

                                        {allTaxCategories?.map((item: any, index: any) => (
                                            <option key={index} value={item.taxCategoryId}>
                                                {item.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.taxCategoryId && <SiteErrorMessage errorMsg='Tax category is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Country </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.countryId ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="countryId" {...register("countryId", { required: false })}
                                    >
                                        <option value=''>--Select--</option>

                                        {allCountries?.map((item: any, index: any) => (
                                            <option key={index} value={item.countryId}>
                                                {item.countryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.countryId && <SiteErrorMessage errorMsg='Tax country is required' />}
                                </div>
                            </div>


                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Tax Rate</label>
                                    <input
                                        type="number"
                                        step="any" // Allow decimal values
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.taxRate ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="taxRate" {...register("taxRate", { required: true })}

                                        placeholder="Enter tax rate in percentage like 2%"
                                    />
                                    {errors.taxRate && <SiteErrorMessage errorMsg='Tax rate is required' />}
                                </div>
                            </div>



                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Tax Rule Type </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.taxRuleType ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="taxRuleType" {...register("taxRuleType", { required: true })}

                                    >

                                        <option value="For Order">For Order</option>
                                        <option value="For Product">For Product</option>

                                    </select>
                                    {errors.taxRuleType && <SiteErrorMessage errorMsg='Tax rule type is required' />}
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

export default AdminTaxRuleAddUpdateForm;