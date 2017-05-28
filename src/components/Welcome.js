import React, { Component } from 'react'
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.history.push('/home');
      } 
    });
  }

  render () {
    return (
      <div className='welcome-page'>
        <h1>Welcome to Onion Sketch</h1>
        <i className="fa fa-pencil-square pencil-logo" aria-hidden="true"></i>
        <p>By Brendan Walker</p>
        <img className='home-logo' />
        <p>An app in progress...</p>
        <p>Please Login or Register</p>
        <Link to='/login'><RaisedButton label='Login'/></Link>
        <span><i className="material-icons">subdirectory_arrow_left</i> <i className="material-icons">subdirectory_arrow_right</i></span>
        <Link to='/register'><RaisedButton label='Register'/></Link>
      </div>
    )
  }
}

export default Welcome;