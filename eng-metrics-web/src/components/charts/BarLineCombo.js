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

export const defaultChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};
const defaultChartData = {
  labels: [],
  datasets: []
};

// export const data = {
//   labels: ["1", "2", "3"],
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: [0, 1, 2],
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: [3, 4, 5],
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

export function BarLineCombo(props) {
  const chartData = (props.data && props.data.labels && props.data.labels.length > 0) ? props.data : defaultChartData;
  const chartOptions = props.options ? props.options : defaultChartOptions;
  return <Bar data={chartData} />;
}