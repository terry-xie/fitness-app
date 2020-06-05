import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { RESET_SESSION } from '../../redux/actionTypes';
import { getSession } from '../../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';

const Logout = props => {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionInfo = useSelector(getSession);

    const onLogout = () => {
        dispatch({
            type: RESET_SESSION
        });
        history.push('/login');
    };

    let logout = null;
    switch(sessionInfo.oauthProvider){
        case 'withings':
            logout = <a onClick={onLogout}>Logout</a>;
            break;
        case 'google':
            logout = <GoogleLogout
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                render={props => (
                    <a onClick={props.onClick}>Logout</a>
                )}
                onLogoutSuccess={onLogout}
            />
            break;
        default:
    }
    
    return logout;
}


export default Logout;