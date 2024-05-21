/* eslint-disable */

import { useEffect, useRef, FC, useState } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { KTIcon, toAbsoluteUrl } from '../../../../../_poscommon/admin/helpers'
import { getCSSVariableValue } from '../../../../../_poscommon/admin/assets/ts/_utils'
import { useThemeMode } from '../../../../../_poscommon/admin/partials'
import { getTopTrendsAnalyticsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { getMonthName } from '../../../../../_poscommon/common/helpers/global/ConversionHelper'
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'


const seriesNames = ['Monthly Sale', 'Net Profit']; // Index 0 for "Monthly Sale", 1 for "Revenue"



type Props = {
  className: string
  chartColor: string
  chartHeight: string
}

const TopTrendsAnalytics: FC<Props> = ({ className, chartColor, chartHeight }) => {
  const [chartData, setChartData] = useState<any>({
    categories: [],
    series: [],
  });

  const [revenueLast12Months, setRevenueLast12Months] = useState<number>(0);
  const [revenueLast6Months, setRevenueLast6Months] = useState<number>(0);
  const [revenueLast1Month, setRevenueLast1Month] = useState<number>(0);



  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart1 = new ApexCharts(chartRef.current, chart1Options(chartColor, chartHeight, chartData.categories, chartData.series))
    if (chart1) {
      chart1.render()
    }

    return chart1
  }

  useEffect(() => {
    const chart1 = refreshChart()

    return () => {
      if (chart1) {
        chart1.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, chartData])

  useEffect(() => {
    getTopTrendsAnalyticsService();
  }, []);

  const getTopTrendsAnalyticsService = () => {
    getTopTrendsAnalyticsApi()
      .then((res: any) => {

        const { data } = res;
        if (data) {

          
          const topTrendMonthlyDataAnalytics = data?.topTrendMonthlyDataAnalytics;

          const categoriesMonthIds = topTrendMonthlyDataAnalytics.map((item: any) => item.monthId);
          let categoriesMonthsName: any = [];
          categoriesMonthIds?.forEach((record: any, index: number) => {
            categoriesMonthsName.push(getMonthName(record))
          });

          const series = [
            // {
            //   name: seriesNames[0],
            //   data: data?.map((item: any) => item.totalOrders),
            // },
            {
              name: seriesNames[0],
              data: topTrendMonthlyDataAnalytics?.map((item: any) => item.totalOrders),
            },
          ];

          setChartData({
            categories: categoriesMonthsName,
            series: series,
          });


          setRevenueLast12Months(data?.revenueLast12Months);
          setRevenueLast6Months(data?.revenueLast6Months);
          setRevenueLast1Month(data?.revenueLast1Month);

        }


      })
      .catch((err: any) => console.log(err, "err"));
  };




  return (
    <div className={`card ${className}`}>
      {/* begin::Beader */}
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Trends in Revenue</span>

          <span className='text-muted fw-semibold fs-7'>Latest trends</span>
        </h3>


      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body d-flex flex-column'>
        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-5-chart card-rounded-top'></div>
        {/* end::Chart */}

        {/* begin::Items */}
        <div className='mt-5'>
          {/* begin::Item */}
          <div className='d-flex flex-stack mb-5'>
            {/* begin::Section */}
            <div className='d-flex align-items-center me-2'>
              {/* begin::Symbol */}
              <div className='symbol symbol-50px me-3'>
                <div className='symbol-label bg-light'>
                  <img
                    src={toAbsoluteUrl('media/svg/brand-logos/plurk.svg')}
                    alt=''
                    className='h-50'
                  />
                </div>
              </div>
              {/* end::Symbol */}

              {/* begin::Title */}
              <div>
                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                  Last One Month
                </a>
                <div className='fs-7 text-muted fw-semibold mt-1'>Revenue in the last month</div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}

            {/* begin::Label */}
            <div className='badge badge-light fw-semibold py-4 px-3'>+{revenueLast1Month}{GetDefaultCurrencySymbol()}</div>
            {/* end::Label */}
          </div>
          {/* end::Item */}

          {/* begin::Item */}
          <div className='d-flex flex-stack mb-5'>
            {/* begin::Section */}
            <div className='d-flex align-items-center me-2'>
              {/* begin::Symbol */}
              <div className='symbol symbol-50px me-3'>
                <div className='symbol-label bg-light'>
                  <img
                    src={toAbsoluteUrl('media/svg/brand-logos/figma-1.svg')}
                    alt=''
                    className='h-50'
                  />
                </div>
              </div>
              {/* end::Symbol */}

              {/* begin::Title */}
              <div>
                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                  Last 6 Months
                </a>
                <div className='fs-7 text-muted fw-semibold mt-1'>Overall revenue in last 6 months</div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}

            {/* begin::Label */}
            <div className='badge badge-light fw-semibold py-4 px-3'>+{revenueLast6Months}{GetDefaultCurrencySymbol()}</div>
            {/* end::Label */}
          </div>
          {/* end::Item */}

          {/* begin::Item */}
          <div className='d-flex flex-stack'>
            {/* begin::Section */}
            <div className='d-flex align-items-center me-2'>
              {/* begin::Symbol */}
              <div className='symbol symbol-50px me-3'>
                <div className='symbol-label bg-light'>
                  <img
                    src={toAbsoluteUrl('media/svg/brand-logos/vimeo.svg')}
                    alt=''
                    className='h-50'
                  />
                </div>
              </div>
              {/* end::Symbol */}

              {/* begin::Title */}
              <div className='py-1'>
                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bold'>
                  Last 12 Months
                </a>

                <div className='fs-7 text-muted fw-semibold mt-1'>Overall statistics for 12 months</div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}

            {/* begin::Label */}
            <div className='badge badge-light fw-semibold py-4 px-3'>+{revenueLast12Months}{GetDefaultCurrencySymbol()}</div>
            {/* end::Label */}
          </div>
          {/* end::Item */}
        </div>
        {/* end::Items */}
      </div>
      {/* end::Body */}
    </div>
  )
}

const chart1Options = (chartColor: string, chartHeight: string, categories: any, series: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor) as string
  const lightColor = getCSSVariableValue('--bs-' + chartColor + '-light')

  return {
    series: series,
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    // fill1: {
    //   type: 'gradient',
    //   opacity: 1,
    //   gradient: {
    //     type: 'vertical',
    //     shadeIntensity: 0.5,
    //     gradientToColors: undefined,
    //     inverseColors: true,
    //     opacityFrom: 1,
    //     opacityTo: 0.375,
    //     stops: [25, 50, 100],
    //     colorStops: [],
    //   },
    // },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: strokeColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 65,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '' + val + ''
        },
      },
    },
    colors: [lightColor],
    markers: {
      colors: [lightColor],
      strokeColors: [baseColor],
      strokeWidth: 3,
    },
  }
}

export { TopTrendsAnalytics }
