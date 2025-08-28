import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import ReactApexChart only on the client side
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IProps {
  title: string;
  items: {
    name: string;
    value: number;
  }[];
  colors: string[];
  labels: string[];
  total: number;
}

const RoundedChart = ({ title, items, colors, labels, total }: IProps) => {
  const series = items.map((item) => item.value);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors,
    labels,
    legend: {
      show: false,
      position: 'bottom',
    },

    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              formatter: () => `${total}`,
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: '400',
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 'bold',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="h-full w-full rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">{title}</h4>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart key={total} options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {items.map((item, index) => (
            <div className="w-full px-7.5 sm:w-1/2" key={index}>
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span> {labels[index]} </span>
                  <span> {((+item.value * 100) / total).toFixed(2)}% </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoundedChart;
