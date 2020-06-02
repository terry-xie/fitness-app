import axios from 'axios';
import qs from 'qs';
import { oauthConfig } from './config';

const redirect = 'http://b9aa74247105.ngrok.io/oauth';

class OauthApi {
    constructor(){
        this.api = axios.create(oauthConfig);
    }

    getAccessToken = accessCode => {
        return this.api.post('/oauth2/token',
            qs.stringify({
                grant_type: 'authorization_code',
                client_id: 'd4ea6caa3b15bdf919fafd6ccfd15acfcf00ef4ac454d66063aa349674f58d5a',
                client_secret: 'c47eea73cde19e646fe61c8fc3697a9dfbf5a695cef6cb2ca8ab486db803fb89',
                code: accessCode,
                redirect_uri: redirect
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

    static getAuthenticationCodeUrl = () => {
        let params = {
            response_type: 'code',
            client_id: 'd4ea6caa3b15bdf919fafd6ccfd15acfcf00ef4ac454d66063aa349674f58d5a',
            state: 'login',
            scope: 'user.metrics',
            redirect_uri: redirect
        }; 

        const res = [];
        for(let param in params)
            res.push(`${param}=${params[param]}`);
        params = res.join('&');

        return `https://account.withings.com/oauth2_user/authorize2?${params}`;
    }
}

export default OauthApi;