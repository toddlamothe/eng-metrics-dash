import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const defaultChartData = {
  labels: [],
  datasets: [],
}

export function BarLineCombo(props) {
  const chartData = (props.data && props.data.labels && props.data.labels.length > 0) ? props.data : defaultChartData;
  return <Chart type='bar' data={chartData} />;
}