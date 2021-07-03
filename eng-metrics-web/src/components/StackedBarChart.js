import React, {useState} from "react";
import Chart from "react-apexcharts";

function StackedBarChart(props) {
    // console.log("stacked bar props: ", props);
    const [options, setOptions] = useState(props.defaultOptions);
    const [series, setSeries] = useState(props.defaultSeries);

    if (!props.defaultOptions || !props.defaultSeries) {
        console.log("Default options or default series not defined")
        return(<div>...</div>);
    }

    return(
        <div className="mixed-chart">
            <Chart
                options={options}
                series={series}
                type="bar"
                width="800"
            />
        </div>
    )
}

export default StackedBarChart;