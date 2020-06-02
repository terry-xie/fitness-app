import React from 'react';
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';

const Graph = (props) => {
    // {
        // xKey: 'date'
    //     firstLine: {
    //         yKey: 'first',
    //         values: [],
    //         name: ''
    //     },

    const firstLineData = props.firstLine.values.map(([x,y]) => ({
        [props.xKey]: x,
        [props.firstLine.yKey]: y
    }));

    // let secondLineData = null;
    // if(props.secondLine)
    // {
    //     secondLineData = props.secondLine.values.map(([x,y]) => ({
    //         [props.xKey]: x,
    //         [props.secondLine.yKey]: y
    //     }));
    // }


    let data = firstLineData;

    // if(secondLineData){
    //     data = [];
    //     for(let i=0;i<firstLineData.length;i++){
    //         data.push({
    //             ...firstLineData[i],
    //             ...secondLineData.find(secondData => secondData[props.xKey] === firstLineData[i][props.xKey])
    //         });
    //     }
    //     for(let i=0;i<secondLineData.length;i++){
    //         const match = firstLineData.find(firstData => firstData[props.xKey] === secondLineData[i][props.xKey]);
    //         if(!match)
    //             data.push({
    //                 [props.xKey]: secondLineData[i][props.xKey],
    //                 [props.secondLine.yKey]: secondLineData[i][props.secondLine.yKey]
    //             });
    //     }
    // }

    // data.sort((a,b)=> a[props.xKey] > b[props.xKey]);
    
    let secondLine = null;
    // if(props.secondLine){
    //     secondLine = <Line type="monotone" dataKey={props.secondLine.yKey} name={props.secondLine.name} stroke="#82ca9d"/>;
    // }

    return (
        <LineChart width={1000} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey={props.xKey}/>
            <YAxis/>
            <CartesianGrid/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey={props.firstLine.yKey} name={props.firstLine.name} stroke="#8884d8" activeDot={{r: 8}}/>
            {secondLine}
        </LineChart>
    )
};

export default React.memo(Graph);