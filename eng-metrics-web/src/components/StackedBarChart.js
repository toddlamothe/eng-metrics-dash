import React, {useState} from "react";
import Chart from "react-apexcharts";

function StackedBarChart(props) {
    // console.log("stacked bar props: ", props);

    // const [chartOptions, setOptions] = useState(props.defaultOptions);
    // const [chartSeries, setSeries] = useState(props.defaultSeries);

    // console.log("Rendering chart component. chartOptions = ", chartOptions);
    return(
        <div className="mixed-chart">
            <Chart
                options={props.defaultOptions}
                series={props.defaultSeries}
                type="bar"
                width="800"
            />
        </div>
    )
}

export default StackedBarChart;