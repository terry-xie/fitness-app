import { SET_SESSION } from '../actionTypes';

const initialState = {
    accessToken: "",
    refreshToken: "",
    id: "",
    name: "",
    isSignedIn: false,
    oauthProvider: '',
    mode: ''
}

export default function(state = initialState, action){
    switch(action.type) {
        case SET_SESSION: 
            const { accessToken, refreshToken, id, name, isSignedIn, oauthProvider, mode } = action.payload;

            return {
                ...state,
                accessToken: accessToken ? accessToken : state.accessToken,
                refreshToken: refreshToken ? refreshToken : state.refreshToken,
                id: id ? id : state.id,
                name: name ? name : state.name,
                isSignedIn: isSignedIn ? isSignedIn : state.isSignedIn,
                oauthProvider: oauthProvider ? oauthProvider : state.oauthProvider,
                mode: mode ? mode : state.mode
            };

        default:
            return state;
    }
}