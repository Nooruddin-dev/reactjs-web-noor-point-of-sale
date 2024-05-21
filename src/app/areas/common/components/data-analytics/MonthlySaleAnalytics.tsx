
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'


import { getCSSVariableValue } from '../../../../../_poscommon/admin/assets/ts/_utils'
import { useThemeMode } from '../../../../../_poscommon/admin/partials'
import { getMonthlySaleAnalyticsApi } from '../../../../../_poscommon/common/helpers/api_helpers/ApiCalls'
import { getMonthName } from '../../../../../_poscommon/common/helpers/global/ConversionHelper'
import { GetDefaultCurrencySymbol } from '../../../../../_poscommon/common/helpers/global/GlobalHelper'


const seriesNames = ['Monthly Sale', 'Revenue']; // Index 0 for "Monthly Sale", 1 for "Revenue"



type Props = {
  className: string
  chartColor: string
  chartHeight: string
}

const MonthlySaleAnalytics: React.FC<Props> = ({ className, chartColor, chartHeight }) => {
  const [chartData, setChartData] = useState<any>({
    categories: [],
    series: [],
  });

  const [monthlyTotalSale, setMonthlyTotalSale] = useState<number>(0);



  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight, chartData.categories, chartData.series))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {

    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, chartData])

  useEffect(() => {
    getMonthlySaleAnalyticsService();
  }, []);

  const getMonthlySaleAnalyticsService = () => {
    getMonthlySaleAnalyticsApi()
      .then((res: any) => {

        const { data } = res;
        if (data) {
          const categoriesMonthIds = data.map((item: any) => item.monthId);
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
              name: seriesNames[1],
              data: data?.map((item: any) => item.totalSale?.toFixed('0')),
            },
          ];

          setChartData({
            categories: categoriesMonthsName,
            series: series,
          });

          const totalSalesSum = data.reduce((accumulator: any, current: any) => {
            return accumulator + current.totalSale;
          }, 0); // Start the accumulator at 0
          setMonthlyTotalSale(totalSalesSum?.toFixed(2) ?? 0);

        }


      })
      .catch((err: any) => console.log(err, "err"));
  };

  


  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0 d-flex justify-content-between flex-column overflow-hidden'>
        {/* begin::Hidden */}
        <div className='d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3'>
          <div className='me-2'>
            <span className='fw-bold text-gray-800 d-block fs-3'>Monthly Sales</span>

            <span className='text-gray-500 fw-semibold'>Jan - {getMonthName(new Date().getMonth())} {new Date().getFullYear()}</span>
          </div>

          <div className={`fw-bold fs-3 text-${chartColor}`}>{GetDefaultCurrencySymbol()}{monthlyTotalSale}</div>
        </div>
        {/* end::Hidden */}

        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-10-chart'></div>
        {/* end::Chart */}
      </div>
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string, categories: any, series: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const secondaryColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)

  return {
    series: series,
    // series: [
    //   {
    //     name: 'Net Profit',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    //   {
    //     name: 'Revenue',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    // ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      //  categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
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
        formatter: (val, { seriesIndex }) => {
          return `$${val?.toFixed(2)}`; // Return with dollar sign and two decimal places
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}

export { MonthlySaleAnalytics }
