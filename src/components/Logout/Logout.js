import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { SET_SESSION } from '../../redux/actionTypes';
import { useDispatch } from 'react-redux';


const Logout = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onSuccessfulLogout = () => {
        dispatch({
            type: SET_SESSION,
            payload: {
                accessToken: "",
                refreshToken: "",
                id: "",
                name: "",
                isSignedIn: false
            }
        });
        history.push('/login');
    };

    return (
        <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={onSuccessfulLogout}
        />
    )

}


export default Logout;