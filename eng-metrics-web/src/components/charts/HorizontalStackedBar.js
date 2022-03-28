import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
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

const labels = ['Epic 1', 'Epic 2', 'Epic 3'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Done',
      data: labels.map(() => -1000),
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'In Progress',
      data: [100, 200, 300, 400, 500, 600 , 700],
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'To Do',
      data: labels.map(() => 500),
      backgroundColor: 'rgb(53, 162, 235)',
    },
  ],
};

export function HorizontalStackedBar() {
  return <Bar options={options} data={data} />;
}