import React, {useState, useMemo, useContext, useEffect} from 'react';
import LogView from '../../components/LogView/LogView';
import { formatDate } from '../../utility/utility';
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

const Log = (props) => {
    const firebase = useContext(FirebaseContext);
    const [logs, setLogs] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [logViewLoading, setLogViewLoading] = useState(true);
    const sessionInfo = useSelector(getSession);

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
                ].sort((a,b) => a.date < b.date);
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
                })).sort((a,b) => a.date < b.date)
            );
            setLogViewLoading(false);
        });
    },[]);

    const bodyFatData = useMemo(() => {
        return logs.map(entry => ({
            x: entry.date,
            y: entry.bodyFat
        })).sort((a,b) => a.x > b.x);
    },[logs]);

    const bodyWeightData = useMemo(() => {
        return logs.map(entry => ({
            x: entry.date,
            y: entry.bodyWeight
        })).sort((a,b) => a.x > b.x);
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

    return(
        <div>
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
            <h1>Body Fat Graph</h1>
            <Graph data={bodyFatData} name="Body Fat"/>
            <h1>Body Weight Graph</h1>
            <Graph data={bodyWeightData} name="Body Weight"/>
        </div>
    )
}

export default Log;