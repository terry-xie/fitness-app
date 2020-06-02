import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Result } from 'antd';
import UserContext from '../UserContext/UserContext';

const ProtectedRoute = props => {
    const {sessionInfo} = useContext(UserContext);

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