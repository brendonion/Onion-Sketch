import { combineReducers } from 'redux';

import {
  REQUEST_LOGIN, 
  REQUEST_LOGIN_FAILURE, 
  REQUEST_LOGIN_SUCCESS,
  REQUEST_AUTH,
  REQUEST_AUTH_FAILURE,
  REQUEST_AUTH_SUCCESS,
  REQUEST_PASSWORD_RESET,
  REQUEST_TOAST_CLOSE,
  REQUEST_TOAST_OPEN,
  REQUEST_ALL_EVENTS,
  REQUEST_EVENTS_FAILURE,
  REQUEST_EVENTS_SUCCESS
} from '../actionTypes/actionTypes.js';

const authenticate = ( state = {
  isFetching: false,
  didFail: false,
}, action) => {
  switch (action.type) {
    case REQUEST_AUTH:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case REQUEST_AUTH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });
    case REQUEST_AUTH_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
      });
    case REQUEST_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
      });
    case REQUEST_LOGIN_FAILURE: 
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });
    case REQUEST_LOGIN:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case REQUEST_PASSWORD_RESET:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
      });
    default:
      return state;
  }
}

const toast = ( state = {
  showToast: false,
  toastMessage: ''
}, action) => {
  switch (action.type) {
    case REQUEST_TOAST_CLOSE:
      return Object.assign({}, state, {
        showToast: action.showToast,
        toastMessage: action.toastMessage
      });
    case REQUEST_TOAST_OPEN:
      return Object.assign({}, state, {
        showToast: action.showToast,
        toastMessage: action.toastMessage
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  authenticate,
  toast
})

export default rootReducer;
