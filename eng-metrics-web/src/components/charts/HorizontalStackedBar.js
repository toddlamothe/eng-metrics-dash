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
  const chartRef = useRef();

  const onClick = (event) => {
    // console.log("getDatasetAtEvent : ");
    const dataSetAtEvent = getDatasetAtEvent(chartRef.current, event);
    console.log("dataSetAtEvent = ", dataSetAtEvent);
    console.log("dataSetAtEvent[0].datasetIndex = ", dataSetAtEvent[0].datasetIndex);
    console.log("getElementAtEvent(chartRef.current, event) = ", getElementAtEvent(chartRef.current, event));
    
    // console.log(getDatasetAtEvent(chartRef.current, event));
    // console.log("getElementAtEvent : ");
    // console.log(getElementAtEvent(chartRef.current, event));
    // console.log("getElementsAtEvent : ");
    // console.log(getElementsAtEvent(chartRef.current, event));
  }

  return (
    <Bar 
      ref={chartRef}
      options={chartOptions} 
      data={chartData}
      onClick={onClick}
    />
  );
}