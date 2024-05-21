



import { FC } from "react"
import { Content } from "../../../../_poscommon/admin/layout/components/content"
import { MonthlySaleAnalytics } from "../../common/components/data-analytics/MonthlySaleAnalytics"
import { OrdersEarningThisMonthAnalytics } from "../../common/components/data-analytics/OrdersEarningThisMonthAnalytics"
import { OverAllSummaryAnalytics } from "../../common/components/data-analytics/OverAllSummaryAnalytics"
import { TodayActiveOrdersAnalytics } from "../../common/components/data-analytics/TodayActiveOrdersAnalytics"
import { TodayHeroProductsAnalytics } from "../../common/components/data-analytics/TodayHeroProductsAnalytics"
import { TopActivitiesAnalytics } from "../../common/components/data-analytics/TopActivitiesAnalytics"
import { TopSaleProductsAnalytics } from "../../common/components/data-analytics/TopSaleProductsAnalytics"
import { TopTrendsAnalytics } from "../../common/components/data-analytics/TopTrendsAnalytics"
import CashierLayout from "../components/CashierLayout"
import CashierPageHeader from "../components/layout/CashierPageHeader"




const DashboardPage: FC = () => (
    <>
        {/* <ToolbarWrapper /> */}
       
        <CashierPageHeader

            title='Dashboard'
            pageDescription='Dashboard'
            addNewClickType={undefined}
            newLink={''}
            onAddNewClick={undefined}
            additionalInfo={{
                showAddNewButton: false
            }
            }
        />

        <Content>

            <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>


                <div className='col-xxl-4'>
                    <TodayActiveOrdersAnalytics className={' h-md-100 mb-5 mb-xl-8'} color={'#f1416c'} />
                </div>

                <div className='col-xxl-4'>
                    <OrdersEarningThisMonthAnalytics className={'h-md-100  mb-5 mb-xl-8'} />
                </div>
                <div className='col-xxl-4'>
                    <TodayHeroProductsAnalytics className={'h-md-100  mb-5 mb-xl-8'} />
                </div>


                <div className='col-xxl-6'>

                    <MonthlySaleAnalytics
                        className='card-xl-stretch mb-5 mb-xl-8'
                        chartColor='primary'
                        chartHeight='250px'
                    />
                </div>

                <div className='col-xxl-6'>
                    <OverAllSummaryAnalytics
                        className=' card-xl-stretch mb-5 mb-xl-8'
                        backGroundColor={'#CBF0F4'} />

                </div>





                <div className='col-xxl-12'>
                    <TopTrendsAnalytics
                        className='card-xxl-stretch mb-5 mb-xl-8'
                        chartColor='success'
                        chartHeight='250px'
                    />
                </div>

                <div className='col-xxl-6'>
                    <TopActivitiesAnalytics
                        className=' card-xl-stretch mb-5 mb-xl-8'
                    />

                </div>
                <div className='col-xxl-6'>
                    <TopSaleProductsAnalytics
                        className=' card-xl-stretch mb-5 mb-xl-8'
                    />

                </div>



            </div>




            {/* begin::Row */}
            <div className='row gx-5 gx-xl-10'>
                {/* begin::Col */}
                <div className='col-xxl-6 mb-5 mb-xl-10'>
                    {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
                </div>
                {/* end::Col */}

                {/* begin::Col */}
                <div className='col-xxl-6 mb-5 mb-xl-10'>
                    {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assetsmedia/stock/600x600/img-65.jpg"></app-cards-widget18> */}
                </div>
                {/* end::Col */}
            </div>
            {/* end::Row */}

        </Content>


    </>
)


const CashierDashboardPage = () => {

    return (
        <>
            <CashierLayout>
               <DashboardPage/>
            </CashierLayout>


        </>
    )
}

export { CashierDashboardPage }