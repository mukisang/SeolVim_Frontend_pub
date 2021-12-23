import { createAction, handleActions } from 'redux-actions';
import * as AuthAPI from '../lib/api_auth'
import { pender } from 'redux-pender';
import { Map } from 'immutable';

const CHANGE_INPUT = 'auth/CHANGE_INPUT'; // input 변경
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'; // form 초기화

const BACK_SIGNUP = 'auth/BACK_SIGNUP'; // 이메일 가입
const BACK_SIGNIN = 'auth/BACK_SIGNIN'; // 이메일 로그인

const SET_ERROR = 'auth/SET_ERROR'; // 오류 설정


export const changeInput = createAction(CHANGE_INPUT); //  { form, name, value }
export const initializeForm = createAction(INITIALIZE_FORM); // form 

export const backsignup = createAction(BACK_SIGNUP, AuthAPI.backsignup); // { email, username, password }
export const backsignin = createAction(BACK_SIGNIN, AuthAPI.backsignin); // { email, password }
export const setError = createAction(SET_ERROR); // { form, message }

const initialState = Map({
    signup: Map({
        form: Map({
            email: '',
            password: '',
            passwordConfirm: ''
        }),
        error: null
    }),
    signin: Map({
        form: Map({
            email: '',
            password: ''
        }),
        error: null
    }),
    result: Map({})
});

export default handleActions({
    [CHANGE_INPUT]: (state, action) => {
        const { form, name, value } = action.payload;
        return state.setIn([form, 'form', name], value);
    },
    [INITIALIZE_FORM]: (state, action) => {
        const initialForm = initialState.get(action.payload);
        return state.set(action.payload, initialForm);
    },
    [SET_ERROR]: (state, action) => {
        const { form, message } = action.payload;
        return state.setIn([form, 'error'], message);
    },
    ...pender({
        type: BACK_SIGNIN,
        onSuccess: (state, action) => state.set('result', Map(action.payload.data))
    }),
    ...pender({
        type: BACK_SIGNUP,
        onSuccess: (state, action) => state.set('result', Map(action.payload.data))
    }),
}, initialState);