import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDZiSWsZ34xRJaXwDbmrB2jDjBPmbijtQk",
  authDomain: "onion-sketch.firebaseapp.com",
  databaseURL: "https://onion-sketch.firebaseio.com",
  projectId: "onion-sketch",
  storageBucket: "onion-sketch.appspot.com",
  messagingSenderId: "648684600422"
};
  
firebase.initializeApp(config);


export const provider = new firebase.auth.FacebookAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;