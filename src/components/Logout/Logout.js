import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import UserContext from '../UserContext/UserContext';
import { useHistory } from 'react-router-dom';


const Logout = props => {
    const { setSignedInUser } = useContext(UserContext);
    const history = useHistory();

    const onSuccessfulLogout = () => {
        setSignedInUser({
            accessToken: "",
            refreshToken: "",
            id: "",
            name: "",
            isSignedIn: false
        });
        history.push('/login');
    };

    return (
        <GoogleLogout
            //clientId=
            buttonText="Logout"
            onLogoutSuccess={onSuccessfulLogout}
        />
    )

}


export default Logout;