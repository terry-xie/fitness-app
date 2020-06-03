import { SET_SESSION, RESET_SESSION } from './actionTypes';

export const setSession = content => ({
    type: SET_SESSION,
    payload: {
        ...content
    }
});

export const resetSession = () => ({
    type: RESET_SESSION
});