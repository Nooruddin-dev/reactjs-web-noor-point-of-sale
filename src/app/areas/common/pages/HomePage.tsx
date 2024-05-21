import React, { useEffect } from 'react';



import { toAbsoluteUrl } from '../../../../_poscommon/admin/helpers';
import { Link } from 'react-router-dom';


export default function HomePage() {

    // useEffect(() => {
    //     const defaultThemeMode = "light";
    //     let themeMode;
    //     if (document.documentElement) {
    //         if (document.documentElement.hasAttribute("data-bs-theme-mode")) {
    //             themeMode = document.documentElement.getAttribute("data-bs-theme-mode");
    //         } else {
    //             if (localStorage.getItem("data-bs-theme") !== null) {
    //                 themeMode = localStorage.getItem("data-bs-theme");
    //             } else {
    //                 themeMode = defaultThemeMode;
    //             }
    //         }
    //         if (themeMode === "system") {
    //             themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    //         }
    //         document.documentElement.setAttribute("data-bs-theme", themeMode ?? 'dark');
    //     }
    // }, []);


    const goToSitePage = (url: string) => {
        window.location.href = url;
    }

    return (
        <div id="kt_body" className="page-bg home-page-main-cover">


            <div className="d-flex flex-column flex-root">

                <div className="page launcher sidebar-enabled d-flex flex-row flex-column-fluid me-lg-5 " id="kt_page" style={{ paddingRight: '0px' }}>

                    <div className="d-flex flex-row-fluid">

                        <div className="d-flex flex-column flex-row-fluid align-items-center">

                            <div className="d-flex flex-column flex-column-fluid mb-5 mb-lg-10">

                                <div className="d-flex flex-center pt-10 pt-lg-0 mb-10 mb-lg-0 h-lg-225px">

                                    <div className="btn btn-icon btn-active-color-primary w-30px h-30px d-lg-none me-4 ms-n15" id="kt_sidebar_toggle">
                                        <i className="ki-duotone ki-abstract-14 fs-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                    </div>

                                    <a href="index.html">
                                        <img alt="Logo"
                                            src={toAbsoluteUrl('media/logos/default-small.png')}
                                            className="h-70px" />
                                    </a>

                                </div>

                                <div className="row g-7 w-xxl-850px">

                                    <div className="col-xxl-5">

                                        <div className="card border-0 shadow-none h-lg-100" style={{ backgroundColor: '#A838FF' }}>

                                            <div className="card-body d-flex flex-column flex-center pb-0 pt-15">

                                                <div className="px-10 mb-10">

                                                    <h3 className="text-white-home-page mb-2 fw-bolder text-center text-uppercase mb-6">Enhance Your Sales Experience</h3>

                                                    <div className="mb-7">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="ki-duotone ki-black-right fs-4 text-white-home-page opacity-75 me-3"></i>
                                                            <span className="text-white-home-page opacity-75">Effortless Transactions</span>
                                                        </div>

                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="ki-duotone ki-black-right fs-4 text-white-home-page opacity-75 me-3"></i>
                                                            <span className="text-white-home-page opacity-75">Real-Time Inventory Updates</span>
                                                        </div>

                                                        <div className="d-flex align-items-center mb-2">
                                                            <i className="ki-duotone ki-black-right fs-4 text-white-home-page opacity-75 me-3"></i>
                                                            <span className="text-white-home-page opacity-75">Customizable Sales Reports</span>
                                                        </div>
                                                    </div>

                                                    <Link to="" onClick={()=>goToSitePage('/kitchen/orders-list')} className="btn btn-hover-rise text-white-home-page bg-white bg-opacity-10 text-uppercase fs-7 fw-bold text-white">Visit Kitchen Area</Link>
                                                </div>


                                                <img className="mw-100 h-225px mx-auto mb-lg-n18" src={toAbsoluteUrl('media/illustrations/sigma-1/12.png')} />

                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-xxl-7">

                                        <div className="row g-lg-7">

                                            <div className="col-sm-6">

                                                <Link to="" onClick={()=>goToSitePage('/cashier/point-of-sale')} className="card border-0 shadow-none min-h-200px mb-7" style={{ backgroundColor: '#F9666E' }} >

                                                    <div className="card-body d-flex flex-column flex-center text-center">

                                                        <img className="mw-100 h-100px mb-7 mx-auto"
                                                            src={toAbsoluteUrl('media/illustrations/sigma-1/4.png')}
                                                        />


                                                        <h4 className="text-white-home-page fw-bold text-uppercase">Go to POS</h4>

                                                    </div>

                                                </Link>

                                            </div>


                                            <div className="col-sm-6">

                                                <Link to="" onClick={()=>goToSitePage('/admin/dashboard')} className="card border-0 shadow-none min-h-200px mb-7" style={{ backgroundColor: '#35D29A' }} >

                                                    <div className="card-body d-flex flex-column flex-center text-center">

                                                        <img className="mw-100 h-100px mb-7 mx-auto"
                                                            src={toAbsoluteUrl('media/illustrations/sigma-1/5.png')}
                                                        />


                                                        <h4 className="text-white-home-page fw-bold text-uppercase">Go to Admin</h4>

                                                    </div>

                                                </Link>

                                            </div>

                                        </div>


                                        <div className="card border-0 shadow-none min-h-200px" style={{ backgroundColor: '#D5D83D' }}>

                                            <div className="card-body d-flex flex-center flex-wrap">

                                                <img className="mw-100 h-200px me-4 mb-5 mb-lg-0"
                                                    src={toAbsoluteUrl('media/illustrations/sigma-1/11.png')}
                                                />

                                                <div className="d-flex flex-column align-items-center align-items-md-start flex-grow-1" data-bs-theme="light">

                                                    <h3 className="text-gray-900 fw-bolder text-uppercase mb-5">Quick Jump</h3>


                                                    <div className="text-gray-800 mb-5 text-center text-md-start">Go to the login page
                                                        <br />directly</div>


                                                    <Link to="" onClick={()=>goToSitePage('/auth/login')} className="btn btn-hover-rise text-gray-900 text-uppercase fs-7 fw-bold" style={{ backgroundColor: '#EBEE51' }} >Login</Link>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="d-flex flex-column-auto flex-center">

                                <ul className="menu fw-semibold order-1">
                                    <li className="menu-item">
                                        <a href="#" target="_blank" className="menu-link text-white-home-page opacity-50 opacity-100-hover px-3">About</a>
                                    </li>

                                    <li className="menu-item">
                                        <a href="#" target="_blank" className="menu-link text-white-home-page opacity-50 opacity-100-hover px-3">Support</a>
                                    </li>
                                    <li className="menu-item">
                                        <Link to="/auth/login" className="menu-link text-white-home-page opacity-50 opacity-100-hover px-3">Login</Link>
                                    </li>
                                </ul>

                            </div>

                        </div>

                    </div>




                </div>

            </div>
        </div>
    )
}
