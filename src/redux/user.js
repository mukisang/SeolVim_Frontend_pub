import { createAction, handleActions } from 'redux-actions';

import { Map } from 'immutable';
import { pender } from 'redux-pender';
import * as APIS from '../lib/api_auth'

const SET_EMAIL = 'user/SET_EMAIL'; // 로그인 정보 설정
const SET_VALIDATED = 'user/SET_VALIDATED'; // validated 값 설정
const SIGNOUT = 'user/SIGNOUT'; // 로그아웃
const CHECK_STATUS = 'user/CHECK_STATUS'; // 현재 로그인상태 확인


export const setEmail = createAction(SET_EMAIL); // loggedInfo
export const setValidated = createAction(SET_VALIDATED); // validated
export const signOut = createAction(SIGNOUT, APIS.signOut);
export const checkStatus = createAction(CHECK_STATUS, APIS.checkStatus);

const initialState = Map({
    email: "",
    logged: false, // 현재 로그인중인지 알려준다
    validated: false // 현재 로그인중인지 아닌지 한번 서버측에 검증했음을 의미
});

export default handleActions({
    [SET_EMAIL]: (state, action) => state.set('email', action.payload).set('logged', true),
    [SET_VALIDATED]: (state, action) => state.set('validated', action.payload),
    ...pender({
        type: CHECK_STATUS,
        onSuccess: (state, action) => state.set('email', action.payload.info.email).set('validated', true),
        onFailure: () => initialState
    })
}, initialState);
