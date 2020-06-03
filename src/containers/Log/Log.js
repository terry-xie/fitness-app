import React, {useState, useMemo, useContext, useEffect} from 'react';
import LogView from '../../components/LogView/LogView';
import {formatDate, createBodyFatGoal} from '../../utility/utility';
import BodyWeightGraph from '../../components/BodyWeightGraph/BodyWeightGraph';
import Graph from '../../components/Graph/Graph';
import { Form, Button, InputNumber, DatePicker, Slider, Switch } from 'antd';
import { FirebaseContext } from '../../components/Firebase';
import { getSession } from '../../redux/selectors';
import { useSelector } from 'react-redux';

const validateMessages = {
    required: '${label} is required!',
    types: {
        float: '${label} is not a valid number!'
    }
};

const marks = {
    1: '1 lb',
    2: '2 lb',
    3: '3 lb',
    4: '4 lb',
    5: '5 lb',
    6: '6 lb',
    7: '7 lb',
    8: '8 lb',
    9: '9 lb',
    10: '10 lb'
};

const Log = (props) => {
    const firebase = useContext(FirebaseContext);
    const [logs, setLogs] = useState([]);
    const [options, setOptions] = useState({
        sliderValue: '1',
        switchChecked: true
    });
    const [formLoading, setFormLoading] = useState(false);
    const [logViewLoading, setLogViewLoading] = useState(true);
    const {sessionInfo} = useSelector(getSession);

    const logFormSubmitHandler = (values) => {
        setFormLoading(true);
        setLogViewLoading(true);
        firebase.addLog({
            date: formatDate(values.date),
            bodyFat: values.bodyFat,
            bodyWeight: values.bodyWeight
        }, sessionInfo.id)
        .then(id => {
            setLogs(prevLogs => {
                return [
                    ...prevLogs,
                    {
                        id: id,
                        date: formatDate(values.date),
                        bodyFat: values.bodyFat,
                        bodyWeight: values.bodyWeight
                    }
                ].sort((a,b) => a.date > b.date);
            });
            setFormLoading(false);
            setLogViewLoading(false);
        });
    };

    useEffect(() => {
        firebase.getLogs(sessionInfo.id)
        .then(logs => {
            setLogs(logs.map(log => ({
                    id: log.id,
                    date: log.date,
                    bodyFat: log.bodyFat,
                    bodyWeight: log.bodyWeight
                }))
            );
            setLogViewLoading(false);
        });
    },[]);

    const bodyFatData = useMemo(() => {
        return logs.map(entry => ([
            entry.date,
            entry.bodyFat
        ])).sort((a,b) => a.date > b.date);
    },[logs]);



    const bodyWeightData = useMemo(() => {
        return logs.map(entry => ({
            date: entry.date,
            bodyWeight: entry.bodyWeight
        })).sort((a,b) => a.date > b.date);
    },[logs]);

    const removeEntryHandler = ids => {
        setLogViewLoading(true);
        const removePromises = [];
        for(let i=0;i<ids.length;i++){
            removePromises.push(firebase.removeLog(ids[i]));
        }
        Promise.all(removePromises).then(() => {
            console.log('Deleted all selected entries')
            setLogs(prevLogs => prevLogs.filter(log => !ids.find(el => log.id === el)));
            setLogViewLoading(false);
        });
    }

    const updateLogsHandler = log => {
        setLogViewLoading(true);
        return new Promise((res,rej) => {
            firebase.updateLog({
                date: formatDate(log.date),
                bodyFat: log.bodyFat,
                bodyWeight: log.bodyWeight
            }, log.id)
            .then(() => {
                setLogs(prevLogs => prevLogs.filter(prevLog => prevLog.id !== log.id).concat([
                    {
                        ...log,
                        date: formatDate(log.date)
                    }
                ]).sort((a,b) => a.date > b.date));
                res();
                setLogViewLoading(false);
            });
        });
    };

    const onChangeSwitch = checked => setOptions(prev => ({
        ...prev, 
        switchChecked: checked 
    }));

    const onChangeSlider = value => setOptions(prev => ({
        ...prev,
        sliderValue: value
    }));


    let goalBodyFatData = null;
    if(logs && logs.length > 0){
        goalBodyFatData = {
            yKey: 'second',
            name: 'Your Goal Body Fat',
            values: createBodyFatGoal({
                        startDate: logs[0].date,
                        endDate: logs[logs.length-1].date,
                        startBodyFat: logs[0].bodyFat,
                        startBodyWeight: logs[0].bodyWeight,
                    }, options.sliderValue)
        }
    }
    
    return(
        <div>
            <h1>{sessionInfo.id}</h1>
            <h1>{sessionInfo.name}</h1>
            <LogView logs={logs} removeEntry={removeEntryHandler} updateEntry={updateLogsHandler} loading={logViewLoading}/>
            <br></br>
            <h1>Log Form</h1>
            <Form
                name="logForm"
                onFinish={logFormSubmitHandler}
                validateMessages={validateMessages}
            >
                <Form.Item
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required: true,
                        }
                    ]}
                >
                    <DatePicker format="MM-DD-YYYY" />
                </Form.Item>
                <Form.Item
                    label="Body Fat"
                    name="bodyFat"
                    rules={[
                        {
                            required: true,
                            type: 'number',
                            min: 0,
                            max: 100
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Body Weight"
                    name="bodyWeight"
                    rules={[
                        {
                            required: true,
                            type: 'number',
                            min: 0,
                            max: 1000
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={formLoading}>
                        Record my gains
                    </Button>
                </Form.Item>
            </Form>
            <div>
                Display Goal: <Switch onChange={onChangeSwitch} defaultChecked={true}/>
                <p>Adjust lbs lost per week</p>
                <Slider defaultValue={1} min={0} max={10} marks={marks} disabled={!options.switchChecked} onChange={onChangeSlider}/>
            </div>
            <h1>Body Fat Graph</h1>
            <Graph 
                xKey="date" 
                firstLine={{
                    yKey: 'first',
                    name: 'Your Body Fat',
                    values: bodyFatData
                }}
                secondLine={goalBodyFatData}
            />
            <h1>Body Weight Graph</h1>
            <BodyWeightGraph data={bodyWeightData}/>
        </div>
    )
}

export default Log;