import React, { useContext } from 'react';
import GoogleLogin from 'react-google-login';
import UserContext from '../UserContext/UserContext';
import { useHistory } from 'react-router-dom';
import { OauthApi } from '../../withingsApi';

const Login = props => {
    const {setSessionInfo} = useContext(UserContext);
    const history = useHistory();

    const onSuccessfulLogin = res => {
        setSessionInfo(prev => ({
            ...prev,
            id: `google${res.googleId}`,
            name: res.profileObj.name,
            isSignedIn: true
        }))
        history.push("/log");
    }

    const onClick = e => {
        e.preventDefault();
        window.location.href = OauthApi.getAuthenticationCodeUrl();
    }

    return (
        <div>
        <GoogleLogin
            //clientId=
            buttonText="Login"
            onSuccess={onSuccessfulLogin}
        />
        <button onClick={onClick}>login</button>
        </div>
    )
};

export default Login;