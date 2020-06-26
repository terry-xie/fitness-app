import React from 'react';
import { Link } from 'react-router-dom';
import { Result } from 'antd';
import { getSession } from '../../redux/selectors';
import { useSelector } from 'react-redux';

const ProtectedRoute = props => {
    const sessionInfo = useSelector(getSession);

    return sessionInfo.isSignedIn ? props.children : 
        (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page. Please login first."
                extra={<Link to="/">Back Home</Link>}
            />
        );
};

export default ProtectedRoute;