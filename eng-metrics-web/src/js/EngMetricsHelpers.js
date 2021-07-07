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
        chart: {
          width: 380,
          type: 'pie',
        },
        title: {
          text: 'Epic Story Points'
      },
        labels: epicNamesArray,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
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
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    export const pieChartBlankSeries = [];

    export function formatAsPercent(rawValue) {
      return Math.round((rawValue + 0) * 100)
    }