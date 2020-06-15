import React, { useEffect } from 'react';
import { OauthApi } from '../../withingsApi';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { SET_SESSION } from '../../redux/actionTypes';

const Oauth = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const code = queryString.parse(history.location.search).code;
        const mode = queryString.parse(history.location.search).state;
        const oauth = new OauthApi();
        oauth.getAccessToken(code)
            .then(res => {
                dispatch({
                    type: SET_SESSION,
                    payload: {
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken,
                        id: res.id,
                        isSignedIn: true,
                        oauthProvider: 'withings',
                        mode: mode
                    }
                });
                history.push('/log');
            })
            .catch(err => {
                console.log(`[Oauth] Error: ${err}`);
                history.push('/error');
            })
    },[]);

    return (
        <div>
            <Spin 
                size="large"   
                style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}
            />
        </div>
    )
}

export default Oauth;