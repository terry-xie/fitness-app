import { SET_SESSION } from './actionTypes';

export const setSession = content => ({
    type: SET_SESSION,
    payload: {
        ...content
    }
});