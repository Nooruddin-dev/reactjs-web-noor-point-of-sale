import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';

interface ManufacturerAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any
}



const ManufacturerAddUpdateForm: React.FC<ManufacturerAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit
}) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmitManufacturerForm = (data: any) => {
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
                    <h2>Create/Update Manufacturer</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitManufacturerForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10'>

                        <div className='row'>


                            <input type='hidden' id="manufacturerIdEditForm" {...register("manufacturerIdEditForm", { required: false })} />
                         
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Manufacturer Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.name ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="name" {...register("name", { required: true })}

                                        placeholder="Enter Manufacturer name"
                                    />
                                    {errors.name && <SiteErrorMessage errorMsg='Manufacturer name is required' />}
                                </div>
                            </div>

                          

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Status </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.isActive ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="isActive" {...register("isActive", { required: true })}

                                    >

                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>

                                    </select>
                                    {errors.isActive && <SiteErrorMessage errorMsg='Status is required' />}
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

export default ManufacturerAddUpdateForm;