import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import penderMiddleware, { penderReducer } from 'redux-pender';

import base from './base';
import auth from './auth'
import user from './user'

const isDevelopment = process.env.NODE_ENV === 'development'
const composeEnhancers = isDevelopment ? (window.__REDUX_DEVTOLLS_EXTENSION_COMPOSE__ || compose) : compose

const configureStore = (initialState) => {
    const store = createStore(combineReducers({
        base,
        auth,
        user,
        pender : penderReducer
    }), initialState, composeEnhancers( applyMiddleware(penderMiddleware())))
    return store;
}

export default configureStore;