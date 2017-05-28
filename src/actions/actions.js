import fetch from 'isomorphic-fetch';
import firebase from 'firebase';
import { push } from 'react-router-redux';

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


const requestLogin = () => {
  return {
    type: REQUEST_LOGIN,
  }
}

const requestPasswordReset = () => {
  return {
    type: REQUEST_PASSWORD_RESET
  }
}

const requestLoginSuccess = (json) => {
  return {
    type: REQUEST_LOGIN_SUCCESS,
    data: json
  }
}

const requestLoginFailure = (error) => {
  return {
    type: REQUEST_LOGIN_FAILURE,
    error: error
  }
}

const requestAuth = () => {
  return {
    type: REQUEST_AUTH
  }
}

const requestAuthFailure = (error) => {
  return {
    type: REQUEST_AUTH_FAILURE,
    error: error
  }
}

const requestAuthSuccess = (user) => {
  return {
    type: REQUEST_AUTH_SUCCESS,
    data: user
  }
}

const requestToastClose = () => {
  return {
    type: REQUEST_TOAST_CLOSE,
    showToast: false,
    toastMessage: ''
  }
}

const requestToastOpen = (error) => {
  return {
    type: REQUEST_TOAST_OPEN,
    showToast: true,
    toastMessage: error
  }
}

export const login = (email, pass) => (dispatch) => {
    //loading done here
    // to push to new areas -> dispatch(push('/login'));
    dispatch(requestLogin());
    firebase.auth().signInWithEmailAndPassword(email, pass).then((data) => {
        dispatch(requestLoginSuccess(data));
        dispatch(push('/home'))
    }).catch((error) => {
        let errorMessage = error.message;
        dispatch(requestLoginFailure());
        dispatch(toastOpen(errorMessage));
    });
}

export const loginWithFacebook = () => (dispatch) => {
    const provider = new firebase.auth.FacebookAuthProvider();
    dispatch(requestLogin());
    firebase.auth().signInWithPopup(provider).then((data) => {
        let token = data.credential.accessToken;
        dispatch(requestLoginSuccess(data));
        dispatch(push('/home'));
    }).catch((error) => {
        let errorMessage = error.message;
        dispatch(requestLoginFailure());
        dispatch(toastOpen(errorMessage));
    });
}

// needs tweaking
export const passwordReset = (email) => (dispatch) => {
    dispatch(requestPasswordReset());
    firebase.auth().sendPasswordResetEmail(email);
}

export const createUser = (email, pass) => (dispatch) => {
    const ref = firebase.database().ref();
    dispatch(requestAuth());
    firebase.auth().createUserWithEmailAndPassword(email, pass).then((user) => {
        ref.child(`users/${user.uid}`)
            .set({
                email: user.email,
                uid: user.uid
            }).then(() => user);
    }).then((user) => {
        dispatch(requestAuthSuccess(user));
        dispatch(push('/home'));
    }).catch((error) => {
        let errorMessage = error.message;
        dispatch(requestAuthFailure());
        dispatch(toastOpen(errorMessage));
    });
}