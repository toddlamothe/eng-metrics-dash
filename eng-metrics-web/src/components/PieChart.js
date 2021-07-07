import React from "react";
import Chart from "react-apexcharts";

function PieChart(props) {
    return(
        <div className="mixed-chart">
            <Chart
                options={props.options}
                series={props.series}
                type="pie" 
                width={380}
            />
        </div>
    )
}

export default PieChart;