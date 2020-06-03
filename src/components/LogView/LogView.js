import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, InputNumber, DatePicker, Popconfirm } from 'antd';
import { DeleteOutlined , EditOutlined} from '@ant-design/icons'
import moment from 'moment';

const validateMessages = {
    required: '${label} is required!',
    types: {
        float: '${label} is not a valid number!'
    }
};

const LogView = (props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalState, setModalState] = useState({
        id: "",
        date: null,
        bodyFat: "",
        bodyWeight: "",
        visible: false
    });
    const [modalFormLoading, setModalFormLoading] = useState(false);
    const [logsLoading, setLogsLoading] = useState(false);

    const data = useMemo(() => props.logs.map(entry => ({
        key: entry.id,
        date: entry.date,
        bodyFat: entry.bodyFat,
        bodyWeight: entry.bodyWeight
    })),[props.logs]);

    const columns = [
        {
            title: 'Date (MM-DD-YYYY)',
            dataIndex: 'date'
        },
        {
            title: 'Body Fat (%)',
            dataIndex: 'bodyFat'
        },
        {
            title: 'Body Weight (lbs)',
            dataIndex: 'bodyWeight'
        },
        {
            render: (_,record) => (
                <React.Fragment>
                    <Button icon={<EditOutlined />} onClick={() => {showModal(record)}} />
                    <Popconfirm 
                        onConfirm={() => removeRows([record.key])}
                        okText="Yes"
                        cancelText="No"
                        title="Are you sure you want to delete this entry?"
                    >
                        <Button icon={<DeleteOutlined />} />
                    </Popconfirm>
                </React.Fragment>
            )
        }
    ];

    const removeRows = keys => {
        setSelectedRowKeys(prevKeys => prevKeys.filter(prevKey => !keys.find(key => prevKey === key)));
        props.removeEntry(keys);
    }

    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const okModal = () => {
        setModalFormLoading(true);
        props.updateEntry({
            id: modalState.id,
            date: modalState.date,
            bodyFat: modalState.bodyFat,
            bodyWeight: modalState.bodyWeight
        })
        .then(() => {
            setModalFormLoading(false);
            hideModal();
        });
    }
    const hideModal = () => setModalState(prev => ({...prev, visible: false}));

    const showModal = record => 
        setModalState({
            id: record.key,
            date: moment(record.date, 'MM-DD-YYYY'),
            bodyFat: record.bodyFat,
            bodyWeight: record.bodyWeight,
            visible: true
        });

    
    const onValuesChange = values => {
        setModalState(prev => ({
            ...prev,
            ...values
        }));
    };

    return (
        <div>
            <h1>Logs</h1>
            <div style={{ marginBottom: 16 }}>
            <Button type="primary" disabled={!selectedRowKeys.length > 0} onClick={() => removeRows(selectedRowKeys)} loading={props.loading}>
                Delete Entries
            </Button>
            <span style={{ marginLeft: 8 }}>
                {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} loading={props.loading}/>
            <Modal
                title="Log"
                visible={modalState.visible}
                okText="Update"
                onOk={okModal}
                onCancel={hideModal}
                destroyOnClose="true"
                confirmLoading={modalFormLoading}
            >
                <Form
                    name="logForm"
                    validateMessages={validateMessages}
                    initialValues={
                        {
                            date: modalState.date,
                            bodyFat: modalState.bodyFat,
                            bodyWeight: modalState.bodyWeight
                        }
                    }
                    onValuesChange={onValuesChange}
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
                        <DatePicker format="MM-DD-YYYY"/>
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
                </Form>
            </Modal>
        </div>
    )
}


export default LogView;