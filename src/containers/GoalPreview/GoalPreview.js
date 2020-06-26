import React, {useState} from 'react';
import GoalGraph from '../../components/GoalGraph/GoalGraph';
import { Form, Button, InputNumber } from 'antd';

const validateMessages = {
    required: '${label} is required!',
    types: {
        float: '${label} is not a valid number!'
    }
};

function GoalPreview(props){
    const [state, setState] = useState({
        initialBodyFat: '',
        initialBodyWeight: '',
        goalBodyFat: ''
    });

    const isFormSubmitted = !!(state.initialBodyFat && state.initialBodyWeight && state.goalBodyFat);

    const formSubmitHandler = (values) => {
        setState({
            initialBodyFat: values.initialBodyFat,
            initialBodyWeight: values.initialBodyWeight,
            goalBodyFat: values.goalBodyFat
        });
    }

    let graphContent = null;
    if(isFormSubmitted) {
        graphContent = (
            <div>
                <h1>Goal Graph</h1>
                <GoalGraph 
                    initialBodyFat = {state.initialBodyFat}
                    initialBodyWeight = {state.initialBodyWeight}
                    goalBodyFat = {state.goalBodyFat}
                />
            </div>
        )
    }

    return (
        <div>
            <Form
                name="goalForm"
                onFinish={formSubmitHandler}
                validateMessages={validateMessages}
            >
                <Form.Item
                    label="Starting Body Fat %"
                    name="initialBodyFat"
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
                    label="Starting Body Weight"
                    name="initialBodyWeight"
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

                <Form.Item
                    label="Goal Body Fat %"
                    name="goalBodyFat"
                    dependencies={['initialBodyFat']}
                    rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                        max: 100
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || !getFieldValue('initialBodyFat') || getFieldValue('initialBodyFat') >= value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Goal body fat should be less than starting body fat!');
                        },
                    }),
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Show me the gains
                    </Button>
                </Form.Item>
            </Form>
            {graphContent}
        </div>
    );
};

export default GoalPreview;