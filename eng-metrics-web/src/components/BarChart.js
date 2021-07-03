import React, {useState, useEffect, useRef} from "react";
import Chart from "react-apexcharts";

function BarChart(props) {
    const defaultOptions = {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      }
    const defaultSeries = [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ];

    const [options, setOptions] = useState(defaultOptions);
    const [series, setSeries] = useState(defaultSeries);

    return(
    <div className="mixed-chart">
        <Chart
            options={options}
            series={series}
            type="bar"
            width="500"
        />
    </div>
    )
}

export default BarChart;