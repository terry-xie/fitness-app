import axios from 'axios';
import qs from 'qs';
import { oauthConfig } from './config';

class OauthApi {
    constructor(){
        this.api = axios.create(oauthConfig);
    }

    getAccessToken = accessCode => {
        return this.api.post('/oauth2/token',
            qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.REACT_APP_WITHINGS_CLIENT_ID,
                client_secret: process.env.REACT_APP_WITHINGS_SECRET,
                code: accessCode,
                redirect_uri: process.env.REACT_APP_WITHINGS_REDIRECT_URI
            })
        ).then(({data}) => {
            return Promise.resolve({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                id: `withings${data.userid}`
            });
        }).catch(err => {
            console.log(`Error getting access token: ${err}`);
            return Promise.reject(err);
        });
    }

    static getAuthenticationCodeUrl = isDemo => {
        let params = {
            response_type: 'code',
            client_id: process.env.REACT_APP_WITHINGS_CLIENT_ID,
            state: isDemo ? 'demo' : 'normal',
            scope: 'user.metrics',
            redirect_uri: process.env.REACT_APP_WITHINGS_REDIRECT_URI,
            mode: isDemo ? 'demo' : ''
        }; 

        const res = [];
        for(let param in params)
            res.push(`${param}=${params[param]}`);
        params = res.join('&');

        return `https://account.withings.com/oauth2_user/authorize2?${params}`;
    }
}

export default OauthApi;