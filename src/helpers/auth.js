import { ref, firebaseAuth, provider } from '../services/Firebase';

// Helper function that authorizes email and password
export function auth(email, pass) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pass)
    .then(saveUser)
}

// Helper function that logs a user out
export function logout() {
  firebaseAuth().signOut();
}

// Helper function that logs in an authorized user
export function login(email, pass) {
  return firebaseAuth().signInWithEmailAndPassword(email, pass);
}

// Helper funciton that resets an authorized user's password
export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

// Helper function that saves a user into the database
// May need changing later
export function saveUser(user) {
  return ref.child(`users/${user.uid}/`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}

export function loginWithFacebook() {  
  firebaseAuth().signInWithPopup(provider).then(function(result) {
    let token = result.credential.accessToken;
    this.setState({user: result.user});
  }.bind(this));
}
