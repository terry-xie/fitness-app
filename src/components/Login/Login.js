import React, { useContext } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { OauthApi } from '../../withingsApi';
import { SET_SESSION } from '../../redux/actionTypes';
import { useDispatch } from 'react-redux';

const Login = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onSuccessfulLogin = res => {
        dispatch({
            type: SET_SESSION,
            payload: {
                id: `google${res.googleId}`,
                name: res.profileObj.name,
                isSignedIn: true
            }
        });
        history.push("/log");
    }

    const onClick = e => {
        e.preventDefault();
        window.location.href = OauthApi.getAuthenticationCodeUrl();
    }

    return (
        <div>
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={onSuccessfulLogin}
        />
        <button onClick={onClick}>login</button>
        </div>
    )
};

export default Login;