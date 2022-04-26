import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  Bar,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent
} from 'react-chartjs-2';

const defaultBarChartData = {
  labels: [],
  datasets: []
};


export const defaultChartOptions = {
  indexAxis: 'y',
  plugins: {
    title: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export function HorizontalStackedBar(props) {
  const chartData = (props.data && props.data.labels) ? props.data : defaultBarChartData;
  const chartOptions = props.options ? props.options : defaultChartOptions;

  return (
    <Bar 
      options={chartOptions} 
      data={chartData}
    />
  );
}