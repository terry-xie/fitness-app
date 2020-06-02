import React from 'react';
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';
import { createDataSet } from '../../utility/utility';

const GoalGraph = (props) => {

    const data = createDataSet([{bodyFat: props.initialBodyFat, bodyWeight: props.initialBodyWeight},{bodyFat: props.goalBodyFat, bodyWeight: props.goalBodyWeight}]);

    return (
        <LineChart width={1000} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="bodyFat" stroke="#8884d8" activeDot={{r: 8}}/>
            <Line type="monotone" dataKey="bodyWeight" stroke="#82ca9d"/>
        </LineChart>
    )
};

export default React.memo(GoalGraph);