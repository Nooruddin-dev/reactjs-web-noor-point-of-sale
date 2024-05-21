/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { KTIcon } from '../../../../../_poscommon/admin/helpers';
import { Controller, useForm } from 'react-hook-form';
import SiteErrorMessage from '../../../common/components/SiteErrorMessage';
import { getAllCountriesApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls';
import ReactSelect from 'react-select';;

interface PosCustomerAddFormInterface {
    isOpen: boolean,
    closeModal: any,
    onSubmit: any
}



const PosCustomerAddForm: React.FC<PosCustomerAddFormInterface> = ({
    isOpen,
    closeModal,
    onSubmit
}) => {

    const { control, register, handleSubmit, reset, getValues, formState: { errors } } = useForm();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [allCountries, setAllCountries] = useState<any>(null);
    const [allCountriesOptions, setAllCountriesOptions] = useState([]);

    const onSubmitCategoryForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    useEffect(() => {
        getAllCountriesService();
    }, []);

    const getAllCountriesService = () => {

        const pageBasicInfoCountry: any = {
            pageNo: 1,
            pageSize: 350
        }
        const pageBasicInfoCountryParams = new URLSearchParams(pageBasicInfoCountry).toString();


        getAllCountriesApi(pageBasicInfoCountryParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setAllCountries(res?.data);

                    const countriesOptionsLocal = res?.data?.map((coutnry: any) => ({
                        value: coutnry.countryId,
                        label: coutnry.countryName
                    }));

                    setAllCountriesOptions(countriesOptionsLocal);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Customer Modal"
            className={"cashier-medium-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Create Customer</h2>

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


                        <input className='' type="file" id="userProfileImage" {...register("userProfileImage", { required: false })} style={{display: 'none'}}/>



                        <div className='row'>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">First Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.firstName ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="firstName" {...register("firstName", { required: true })}

                                        placeholder="Enter first name"
                                    />
                                    {errors.firstName && <SiteErrorMessage errorMsg='First name is required' />}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Last Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.lastName ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="lastName" {...register("lastName", { required: true })}

                                        placeholder="Enter last name"
                                    />
                                    {errors.lastName && <SiteErrorMessage errorMsg='Last name is required' />}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label ">Email Address</label>
                                    <input
                                        type="email"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.emailAddress ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="emailAddress" {...register("emailAddress", { required: false })}

                                        placeholder="Enter email address"
                                    />
                                    {errors.emailAddress && <SiteErrorMessage errorMsg='Enter valid email address' />}
                                </div>
                            </div>





                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Country </label>


                                    <Controller
                                        name="countryId" // The name of your input field
                                        control={control}

                                        rules={{ required: 'Please select at least one country' }}
                                        render={({ field }) => (
                                            <ReactSelect
                                                {...field}
                                                isMulti={false}

                                                options={allCountriesOptions}
                                            />
                                        )}
                                    />





                                    {errors.countryId && <SiteErrorMessage errorMsg='Country is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Mobile No</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.phoneNo ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="phoneNo" {...register("phoneNo", { required: true })}

                                        placeholder="Enter mobile/phone no"
                                    />
                                    {errors.phoneNo && <SiteErrorMessage errorMsg='Mobile no is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Address</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.addressOne ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="addressOne" {...register("addressOne", { required: false })}

                                        placeholder="Enter address here"
                                    />
                                    {errors.addressOne && <SiteErrorMessage errorMsg='Address is required' />}
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

export default PosCustomerAddForm;