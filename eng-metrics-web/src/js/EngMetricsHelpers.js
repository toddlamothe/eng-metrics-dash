// Transform the raw json recieved from the API to a 
// payload the ApexCharts stacked bar chart can handle
export function FormatEpicDataForBarChart(epicData) {
    // Create a separate array for each status
    const epicNames = [];
    const issuesToDoValues = [];
    const issuesInProgressValues = [];
    const issuesDoneValues = [];
    const issuesUnestimatedValues = [];
    // 2. Create an ordered array of epics
    epicData.forEach( epic => {
        epicNames.push(epic.name);
        issuesToDoValues.push(epic.issuesToDo);
        issuesInProgressValues.push(epic.issuesInProgress);
        issuesDoneValues.push(epic.issuesDone);
        issuesUnestimatedValues.push(epic.issuesUnestimated);
    })

    // Then, iterate through each status and for each one, 
    // push that epic's status values onto the status array
    const defaultSeries = 
    [
        {
        name: 'Done',
        data: issuesDoneValues
        }, {
        name: 'In Progress',
        data: issuesInProgressValues
        }, {
        name: 'To Do',
        data: issuesToDoValues
        }, {
        name: 'Unestimated',
        data: issuesUnestimatedValues
        }]
        
    const defaultOptions = 
    {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        width: "100%"
      },
      colors: ['#00b300', '#ffc000', '#ff8000', '#111111'],
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      title: {
        text: 'Epic Stories by Status'
      },
      xaxis: {
        categories: epicNames,
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
    
    return ({
        "defaultSeries": defaultSeries,
        "defaultOptions": defaultOptions
    })
};

// Transform the raw json recieved from the API to a 
// payload the ApexCharts velocity bar chart can handle
export function FormatVelocityDataForBarChart(velocityData) {
  var options = {
    bar: {
      columnWidth: "80%"
    },
    title: {
      text: 'Velocity'
    }
  };

  var series = [
    {
      name: "Completed"
    }
  ];

  series[0].data = velocityData.map( (sprint) => {
    return {
      x: sprint.end_date.slice(0,10),
      y: sprint.points_done,
      goals: [
        {
          name: "Estimated",
          value: sprint.points_estimated,
          strokeWidth: 5,
          strokeColor: "#775DD0"
        }
      ]
    }
  })

  // console.log("chart series data: ", JSON.stringify(series));

  return ({
    "series": series,
    "options": options
  });
}

export const stackedBarChartBlankSeries = 
    [
        {
        name: 'Done',
        data: []
        }, {
        name: 'In Progress',
        data: []
        }, {
        name: 'To Do',
        data: []
        }, {
        name: 'Unestimated',
        data: []
        }]

export const stackedBarChartBlankOptions = 
    {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        plotOptions: {
            bar: {
            horizontal: true,
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        title: {
            text: 'Epic Stories by Status'
        },
        xaxis: {
            categories: [],
            labels: {
                formatter: function (val) {
                    return val
                }
            }
        },
        yaxis: {
            title: {
                text: undefined
            },
        },
        tooltip: {
            y: {
            formatter: function (val) {
                return val
            }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    };

export function FormatEpicDataForPieChart(epicData) {
  const epicNamesArray = [];
  const epicTotalPointsArray = [];
  epicData.forEach( epic => {
    epicNamesArray.push(epic.name);
    epicTotalPointsArray.push(epic.totalPoints);
  });
  const chartSeries = epicTotalPointsArray;

  const chartOptions = {
    title: {
      text: 'Epic Story Points'
    },
    labels: epicNamesArray,
    legend: {
      position: "top"
    },
    plotOptions: {
      pie: {
        customScale: 1
      }
    }
  };

  return ({
    options: chartOptions,
    series: chartSeries
  })
}

export const pieChartBlankOptions = {
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: [],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};

export const pieChartBlankSeries = [];

export function formatAsPercent(rawValue) {
  return parseFloat( (rawValue + 0) * 100 ).toFixed(2);
}


// export function FormatSprintDataForBarChart(sprintData) {
//   const sampleChartOptions = {
//     series: [
//       {
//         name: "Actual",
//         data: [
//           {
//             x: "2011",
//             y: 1292,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 1400,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2012",
//             y: 4432,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 5400,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2013",
//             y: 5423,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 5200,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2014",
//             y: 6653,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 6500,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2015",
//             y: 8133,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 6600,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2016",
//             y: 7132,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 7500,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2017",
//             y: 7332,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 8700,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           },
//           {
//             x: "2018",
//             y: 6553,
//             goals: [
//               {
//                 name: "Expected",
//                 value: 7300,
//                 strokeWidth: 5,
//                 strokeColor: "#775DD0"
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     chart: {
//       height: 350,
//       type: "bar"
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "60%"
//       }
//     },
//     colors: ["#00E396"],
//     dataLabels: {
//       enabled: false
//     },
//     legend: {
//       show: true,
//       showForSingleSeries: true,
//       customLegendItems: ["Actual", "Expected"],
//       markers: {
//         fillColors: ["#00E396", "#775DD0"]
//       }
//     }
//   }
  
  
//   return ({
//     "defaultSeries": sampleChartOptions.series,
//     "defaultOptions": sampleChartOptions.plotOptions
//   })
// }

export const velocityChartBlankOptions = {
  bar: {
    columnWidth: "60%"
  },
  title: {
    text: 'Velocity'
  }
};

export const velocityChartBlankSeries = [
  {
    name: "Actual",
    data: []
    }
  ];
