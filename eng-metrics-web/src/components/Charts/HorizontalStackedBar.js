import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';

const defaultBarChartData = {
  labels: [],
  datasets: []
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
  const chartData = props.data ? props.data : defaultBarChartData;
  const chartOptions = props.options ? props.options : options;
  return (
    <HorizontalBar data={chartData} options={chartOptions} />
  )
};

export default HorizontalStackedBar;