import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = (props) => {
    return (
        <>
            <Pie height={150} data={props.data} options={{
                legend:{display:false},
                title: {display: false},
                tooltips: {
                    enabled: true
                },          
            }} 
        />
        </>
        );      
}

export default PieChart;