import React from 'react';
import { Bar } from 'react-chartjs-2';

const defaultChartData = {
    labels: [],
    datasets: []
  };
  
const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const HorizontalStackedBar = (props) => {
    const chartData = props.data ? props.data : defaultChartData;
    return (
        <>
          <Bar data={chartData} options={options} />
        </>
      )
};

export default HorizontalStackedBar;