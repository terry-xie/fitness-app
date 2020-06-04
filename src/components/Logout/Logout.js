import React, { useContext, useEffect } from 'react';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { RESET_SESSION } from '../../redux/actionTypes';
import { getSession } from '../../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';


const Logout = props => {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionInfo = useSelector(getSession);

    const onSuccessfulLogout = () => {
        dispatch({
            type: RESET_SESSION
        });
        history.push('/login');
    };

    useEffect(() => {
        if(sessionInfo.oauthProvider === 'withings'){
            dispatch({
                type: RESET_SESSION
            });
            history.push('/login');
        }
    },[])

    return (
        <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={onSuccessfulLogout}
        />
    )

}


export default Logout;