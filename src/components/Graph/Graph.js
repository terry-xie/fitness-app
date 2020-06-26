import React from 'react';
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';

const Graph = (props) => {
    // const data = props.data;

    // if(data.length > 1){
    //     //there are enough entries to show progress
    //     const step = 1;
    //     data[0].y2 = data[0].y;

    //     for(let i=1;i<data.length;i++){
    //         const idealWeight = (data[0].y - (moment(data[i].x, 'MM-DD-YYYY').diff(moment(data[0].x, 'MM-DD-YYYY'), 'days') * step/7)).toFixed(2);
    //         data[i].y2 = idealWeight;
    //     }
    // }

    return (
        <LineChart width={1000} height={300} data={props.data} margin={{top: 5, right: 30, left: 20, bottom: 5}} style={{display: 'block', margin: '0 auto'}}>
            <XAxis dataKey="x"/>
            <YAxis/>
            <CartesianGrid/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="y" name={props.name} stroke="#8884d8" activeDot={{r: 8}}/>
            {/* <Line type="monotone" dataKey="y2" name="Ideal" stroke="#8884d8" activeDot={{r: 8}}/> */}
        </LineChart>
    )
};

export default React.memo(Graph);