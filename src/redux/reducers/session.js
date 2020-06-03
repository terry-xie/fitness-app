import { SET_SESSION } from '../actionTypes';

const initialState = {
    accessToken: "",
    refreshToken: "",
    id: "",
    name: "",
    isSignedIn: false
}

export default function(state = initialState, action){
    switch(action.type) {
        case SET_SESSION: 
            const { accessToken, refreshToken, id, name, isSignedIn } = action.payload;
            return {
                ...state,
                accessToken: accessToken,
                refreshToken: refreshToken,
                id: id,
                name: name,
                isSignedIn: isSignedIn
                //maybe only assign if value is passed
            };

        default:
            return state;
    }
}