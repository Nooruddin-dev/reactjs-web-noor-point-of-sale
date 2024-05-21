import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon } from '../../../../../_poscommon/admin/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';

interface CategoryAddFormInterface {
    isOpen: boolean,
    closeModal: any,
    parentCategoriesDropdown: any,
    defaultValues: any,
    onSubmit: any
}



const CategoryAddForm: React.FC<CategoryAddFormInterface> = ({
    isOpen,
    closeModal,
    parentCategoriesDropdown,
    defaultValues,
    onSubmit
}) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
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
            className={"admin-medium-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Create/Update Category</h2>

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


                            <input type='hidden' id="catgIdEditForm" {...register("catgIdEditForm", { required: false })} />
                            <input type='hidden' id="attachmentID" {...register("attachmentID", { required: false })} />

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Category Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.name ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="name" {...register("name", { required: true })}

                                        placeholder="Enter category name"
                                    />
                                    {errors.name && <SiteErrorMessage errorMsg='Category name is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label">Parent Category </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.parentCategoryID ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="parentCategoryID" {...register("parentCategoryID", { required: false })}
                                    >
                                        <option value=''>--Select--</option>

                                        {parentCategoriesDropdown?.map((item: any, index: any) => (
                                            <option key={index} value={item.categoryId}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>

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

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Category Image </label>
                                    <input className='form-control' type="file" id="categoryImage" {...register("categoryImage", { required: false })} />

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

export default CategoryAddForm;