import React from 'react';
import { Bar } from 'react-chartjs-2';

const defaultChartData = {
    labels: [],
    datasets: []
  };
  
  const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
        label: 'Points Completed',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        },
        {
            label: 'Points Estimated',
            data: [3, 10, 2, 4, 2, 3],
            type: "line",
            borderWidth: 1,
    
        }
    ],
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