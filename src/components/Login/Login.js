import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { OauthApi } from '../../withingsApi';
import { SET_SESSION } from '../../redux/actionTypes';
import { useDispatch } from 'react-redux';
import { Button, Space } from 'antd';

const Login = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onSuccessfulLogin = res => {
        dispatch({
            type: SET_SESSION,
            payload: {
                id: `google${res.googleId}`,
                name: res.profileObj.name,
                isSignedIn: true,
                oauthProvider: 'google'
            }
        });
        history.push("/log");
    }

    const onClick = e => {
        e.preventDefault();
        window.location.href = OauthApi.getAuthenticationCodeUrl();
    }

    const onDemoClick = e => {
        e.preventDefault();
        window.location.href = OauthApi.getAuthenticationCodeUrl(true);
    }

    return (
        <div>
            <Space direction="vertical">
                <p>Login with Google to record/track your own progress, or login with Withings to access your Withings stats.</p>
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={onSuccessfulLogin}
                />
                <Button onClick={onClick}>Withings Login</Button>
                <br/>
                <p>Use the Demo login to access a demo version of the app using sample data from Withings.</p>
                <Button onClick={onDemoClick}>Demo Login</Button>
            </Space>
        </div>
    )
};

export default Login;