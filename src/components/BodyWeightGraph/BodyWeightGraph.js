import React from 'react';
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';

const BodyWeightGraph = (props) => {
    const {data} = props;

    return (
        <LineChart width={1000} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="bodyWeight" stroke="#8884d8" activeDot={{r: 8}}/>
        </LineChart>
    )
};

export default React.memo(BodyWeightGraph);