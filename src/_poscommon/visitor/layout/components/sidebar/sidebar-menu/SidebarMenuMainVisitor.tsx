import { Link } from "react-router-dom"



const SidebarMenuMainVisitor = () => {


  return (
    <>
      <div className="nav d-flex justify-content-xxl-between flex-wrap gap-5 flex-column align-items-center justify-content-center" role="tablist">


        {/* <li className="nav-item mb-2" role="presentation">

          <Link
            to='/visitor/dashboard'
            className="nav-link btn btn-active-success btn-center visitor-nav-link-bg btn-color-gray-600 rounded-3 flex-column overflow-hidden w-80px h-75px pt-7 pt-lg-5 pb-2 d-flex justify-content-center align-items-center active"  aria-selected="true" role="tab">

            <div className="nav-icon mb-3">
              <i className="ki-outline ki-chart-line-star fs-2x p-0"></i>
            </div>



            <span className="fw-semibold fs-7 lh-1">
              Dashboard
            </span>

          </Link>

        </li> */}



        <li className="nav-item mb-2" role="presentation">

          <Link
            to='/visitor/pos-main'
            className="nav-link btn btn-active-success btn-center visitor-nav-link-bg btn-color-white-600 rounded-3 flex-column overflow-hidden w-80px h-75px pt-7 pt-lg-5 pb-2 d-flex justify-content-center align-items-center active"  aria-selected="false" role="tab" tabIndex={-1}>

            <div className="nav-icon mb-3">
              <i className="ki-outline ki-bus fs-2x p-0"></i>
            </div>

            <span className="fw-semibold fs-7 lh-1">
              Services
            </span>

          </Link>

        </li>


        <li className="nav-item mb-2" role="presentation">

          <Link
            to="/visitor/offers"
            className="nav-link btn btn-active-success btn-center visitor-nav-link-bg btn-color-white-600 rounded-3 flex-column overflow-hidden w-80px h-75px pt-7 pt-lg-5 pb-2 d-flex justify-content-center align-items-center"  aria-selected="false" role="tab" tabIndex={-1}>

            <div className="nav-icon mb-3">
              <i className="ki-outline ki-folder-up fs-2x"></i>
            </div>

            <span className="fw-semibold fs-7 lh-1">
              Offers
            </span>

          </Link>

        </li>


        {/* <li className="nav-item mb-2" role="presentation">

          <Link className="nav-link btn btn-active-success btn-center visitor-nav-link-bg btn-color-white-600 rounded-3 flex-column overflow-hidden w-80px h-75px pt-7 pt-lg-5 pb-2 d-flex justify-content-center align-items-center" aria-selected="false" role="tab" tabIndex={-1}>

            <div className="nav-icon mb-3">
              <i className="ki-outline ki-bus fs-2x p-0"></i>
            </div>

            <span className="fw-semibold fs-7 lh-1">
              Offers
            </span>

          </Link>

        </li>
 */}

      </div>
    </>
  )
}

export { SidebarMenuMainVisitor }
