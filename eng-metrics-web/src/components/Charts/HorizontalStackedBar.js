import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';

const data = {
  labels: ['Epic 1', 'Epic 2', 'Epic 3', 'Epic 4', 'Epic 5', 'Epic 6'],
  datasets: [
    {
      label: 'Done',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'In Progress',
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: 'rgb(54, 162, 235)',
    },
    {
      label: 'To Do',
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'Unestimated',
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: 'rgb(100, 100, 100)',
    },
  ]
};

const options = {
  indexAxis: 'y',
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,

  scales: {
    yAxes: [{
      stacked: true
    }],
    xAxes: [{
        stacked: true,
        ticks: {
            beginAtZero: true,
            min: 0
        }
    }],
  },

  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: false,
      text: '',
    },
  },
};

const HorizontalStackedBar = (props) => {
  const chartData = props.data ? props.data : data;
  const chartOptions = props.options ? props.options : options;
  return (
    <HorizontalBar data={chartData} options={chartOptions} />
  )
};

export default HorizontalStackedBar;