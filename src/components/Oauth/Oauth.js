import React, { useEffect } from 'react';
import { OauthApi } from '../../withingsApi';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Spin } from 'antd';

const Oauth = props => {
    const history = useHistory();

    useEffect(() => {
        const code = queryString.parse(history.location.search).code;
        const oauth = new OauthApi();
        oauth.getAccessToken(code)
            .then(res => {
                props.setSessionInfo(prev => ({
                    ...prev,
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    id: res.id,
                    isSignedIn: true
                }));
                history.push('/withings');
            })
            .catch(err => {
                console.log(`[Oauth] Error: ${err}`);
                history.push('/error');
            })
    },[]);

    return (
        <div>
            Loading...
            <Spin size="large"/>
        </div>
    )
}

export default Oauth;