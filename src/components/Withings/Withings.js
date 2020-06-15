import React, { useState, useContext, useEffect } from 'react';
import { DataApi } from '../../withingsApi';
import { Table, Typography, Space, Radio } from 'antd';
import { useSelector } from 'react-redux';
import { getSession } from '../../redux/selectors';

const { Text } = Typography;

const dailyColumns = [
    {
        title: 'Date (MM-DD-YYYY)',
        dataIndex: 'date'
    },
    {
        title: 'Total Weight (lbs)',
        dataIndex: 'weight'
    },
    {
        title: 'Muscle Mass (lbs)',
        dataIndex: 'muscleMass'
    },
    {
        title: 'Fat Mass (lbs)',
        dataIndex: 'fatMass'
    },
    {
        title: 'Water Weight (lbs)',
        dataIndex: 'waterWeight'
    },
    {
        title: 'Body Fat (%)',
        dataIndex: 'bodyFat'
    },
];

const weeklyColumns = [
    {
        title: 'Date (Month-Day-Year)',
        dataIndex: 'date'
    },
    {
        title: 'Average Total Weight (lbs)',
        dataIndex: 'weight'
    },
    {
        title: 'Average Muscle Mass (lbs)',
        dataIndex: 'muscleMass'
    },
    // {
    //     title: 'Difference From Previous Week (lbs)',
    //     render: (text, record, index) => {
    //         if(!record.diff)
    //             return;

    //         const diff = record.diff > 0 ? <Text>{`+${record.diff}`}</Text> : <Text type="danger">{`${record.diff}`}</Text>
    //         return diff;
    //     }
    // },
    {
        title: 'Average Fat Mass (lbs)',
        dataIndex: 'fatMass'
    },
    {
        title: 'Average Water Weight (lbs)',
        dataIndex: 'waterWeight'
    },
    {
        title: 'Average Body Fat (%)',
        dataIndex: 'bodyFat'
    }
];

const Withings = props => {
    const sessionInfo = useSelector(getSession);
    const { accessToken } = sessionInfo;
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statMode, setStatMode] = useState('day');

    const dailyData = measurements.reduce((acc, curr) => {
        if(curr.muscleMass){
            acc.push({
                key: curr.date.unix(),
                date: curr.date.format('MM-DD-YYYY'),
                muscleMass: curr.muscleMass,
                weight: curr.weight,
                fatMass: curr.fatMass,
                waterWeight: curr.waterWeight,
                bodyFat: curr.bodyFat
            });
        }
        return acc;
    },[]);

    const weeklyData = getWeeklyAverages(groupIntoWeeks(measurements));

    const onRadioChange = e => {
        setStatMode(e.target.value);
    }

    useEffect(() => {
        DataApi.getMeasurements(accessToken)
            .then(res => {
                setMeasurements(res);
                setLoading(false);
            })
            .catch(err => {});
    },[]);

    let view = null;
    switch(statMode){
        case 'day':
            view = <Table columns={dailyColumns} dataSource={dailyData} loading={loading}/>
            break;
        case 'week':
            view = <Table columns={weeklyColumns} dataSource={weeklyData} loading={loading}/>
            break;
        default:
    }

    return (
        <div>
            <div style={{marginBottom: '16px'}}>
                <Space>
                    <b>Display stats by:</b>
                    <Radio.Group 
                        defaultValue="day"
                        buttonStyle="solid"
                        onChange={onRadioChange}
                    >
                        <Radio.Button value="day">Daily</Radio.Button>
                        <Radio.Button value="week">Weekly</Radio.Button>
                    </Radio.Group>
                </Space>
            </div>
            <div>
                {view}
            </div>
        </div>
    )
}

const groupIntoWeeks = data => {
    return data.reduce((acc, curr) => {
        if(!curr.muscleMass)
            return acc;

        const yearWeek = `Week of ${curr.date.clone().startOf('week').format('MM-DD-YYYY')}`;
        if(!acc[yearWeek])
            acc[yearWeek] = [];
        
        acc[yearWeek].push({
            muscleMass: curr.muscleMass,
            weight: curr.weight,
            fatMass: curr.fatMass,
            waterWeight: curr.waterWeight,
            bodyFat: curr.bodyFat
        });
        return acc;
    }, {});
}

const getWeeklyAverages = data => {
    const result = [];
    for(let week in data){
        const weekTotal = data[week].reduce((acc,curr) => {
            return {
                muscleMass: acc.muscleMass + parseFloat(curr.muscleMass),
                weight: acc.weight + parseFloat(curr.weight),
                fatMass: acc.fatMass + parseFloat(curr.fatMass),
                waterWeight: acc.waterWeight + parseFloat(curr.waterWeight),
                bodyFat: acc.bodyFat + parseFloat(curr.bodyFat)
            }
        },{
            muscleMass: 0,
            weight: 0,
            fatMass: 0,
            waterWeight: 0,
            bodyFat: 0
        });
        result.push({
            key: week,
            date: week,
            muscleMass: (weekTotal.muscleMass/(data[week].length)).toFixed(2),
            weight: (weekTotal.weight/(data[week].length)).toFixed(2),
            fatMass: (weekTotal.fatMass/(data[week].length)).toFixed(2),
            waterWeight: (weekTotal.waterWeight/(data[week].length)).toFixed(2),
            bodyFat: (weekTotal.bodyFat/(data[week].length)).toFixed(2),
        });
    }

    if(result.length <= 1)
        return result;

    //set gains/loss
    for(let i=0;i<result.length-1;i++){
        const diff = (result[i].muscleMass - result[i+1].muscleMass).toFixed(2);
        result[i] = {
            ...result[i],
            diff: diff
        };
    }
    return result;
}

export default Withings;