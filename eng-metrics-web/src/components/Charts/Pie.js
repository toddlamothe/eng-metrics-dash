import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = (props) => {
    return (
        <>
            <Pie height={250} data={props.data} options={{
            legend:{display:true},
            title: {display: false},
        }} />
        </>
        );      
}

export default PieChart;