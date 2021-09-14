import React from "react";
import Chart from "react-apexcharts";

function VerticalBarChart(props) {
    return(
        <div className="mixed-chart">
            <Chart
                options={props.defaultOptions}
                series={props.defaultSeries}
                type="bar"
                width="100%"
                height="600px"              
            />
        </div>
    )
}

export default VerticalBarChart;