import React, {useState, useMemo, useContext, useEffect} from 'react';
import LogView from '../../components/LogView/LogView';
import { formatDate } from '../../utility/utility';
import Graph from '../../components/Graph/Graph';
import { Form, Button, InputNumber, DatePicker, Radio, Divider, Space } from 'antd';
import { FirebaseContext } from '../../components/Firebase';
import { getSession } from '../../redux/selectors';
import { useSelector } from 'react-redux';

const validateMessages = {
    required: '${label} is required!',
    types: {
        number: '${label} is not a valid number!'
    }
};

const formItemLayout = {
    labelCol: {span: 2},
};

const formTailLayout = {
    wrapperCol: {span: 2, offset: 2}
}


const Log = (props) => {
    const firebase = useContext(FirebaseContext);
    const [logs, setLogs] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [logViewLoading, setLogViewLoading] = useState(true);
    const [viewMode, setViewMode] = useState('log');
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
                ]).sort((a,b) => a.date < b.date));
                res();
                setLogViewLoading(false);
            });
        });
    };

    const onRadioChange = e => {
        setViewMode(e.target.value);
    }

    let view = null;
    switch(viewMode){
        case 'log':
            view = <LogView logs={logs} removeEntry={removeEntryHandler} updateEntry={updateLogsHandler} loading={logViewLoading}/>
            break;
        case 'graph':
            view = 
                <React.Fragment>
                    <div style={{margin: '5px'}}>
                        <h2 style={{textAlign: 'center'}}>Body Weight</h2>
                        <Graph data={bodyWeightData} name="Body Weight"/>
                    </div>
                    <div style={{margin: '30px'}}>
                        <h2 style={{textAlign: 'center'}}>Body Fat</h2>
                        <Graph data={bodyFatData} name="Body Fat"/>
                    </div>
                </React.Fragment>;
            break;
        default:
    }

    return(
        <div>
            <div style={{marginBottom: '16px'}}>
                <Space>
                    <b>Display:</b>
                    <Radio.Group 
                        defaultValue="log"
                        buttonStyle="solid"
                        onChange={onRadioChange}
                    >
                        <Radio.Button value="log">Log</Radio.Button>
                        <Radio.Button value="graph">Graph</Radio.Button>
                    </Radio.Group>
                </Space>
            </div>
            <div>
                {view}
            </div>
            <Divider/>
            <div>
                <Form
                    name="logForm"
                    onFinish={logFormSubmitHandler}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        {...formItemLayout}
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
                        {...formItemLayout}
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
                        <InputNumber 
                            placeholder="lbs"
                            precision="1"
                            min="0"
                            max="1000"
                        />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
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
                        <InputNumber 
                            placeholder="%"
                            precision="1"
                            min="0"
                            max="100"
                        />
                    </Form.Item>
                    <Form.Item {...formTailLayout}>
                        <Button type="primary" htmlType="submit" loading={formLoading}>Add New Entry</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Log;