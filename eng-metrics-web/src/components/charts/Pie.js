import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const defaultPieChartData = {
  labels: [],
  datasets: [],
};

export function PieChart(props) {
  const chartData = (props.data && props.data.labels) ? props.data : defaultPieChartData;

  return <Pie data={chartData} options={{
    legend:{display:false},
    title: {display: false},
    tooltips: {
        enabled: true
    },          
}}  />;
}