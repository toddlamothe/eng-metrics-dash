import React from "react";
import Chart from "react-apexcharts";

function StackedBarChart(props) {
    return(
        <div className="mixed-chart">
            <Chart
                options={props.defaultOptions}
                series={props.defaultSeries}
                type="bar"
            />
        </div>
    )
}

export default StackedBarChart;