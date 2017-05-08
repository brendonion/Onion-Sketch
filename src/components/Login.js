import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { login, resetPassword, loginWithFacebook } from '../helpers/auth'

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginMessage: null
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    login(this.email.getValue(), this.pass.getValue())
    .catch((error) => {
      this.setState(setErrorMsg('Invalid username/password.'))
    });
  }

  resetPassword() {
    resetPassword(this.email.getValue())
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)));
  }

  render() {

    return (
      <div className='login-form'>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <TextField 
              ref={(email) => this.email = email}
              floatingLabelText='Email'
              type='email'
            />
          </div>
          <div>
            <TextField 
              ref={(pass) => this.pass = pass}
              floatingLabelText='Password'
              type='password'
            />
          </div>
          <RaisedButton 
            type='submit'
            label='Submit'
            primary={true}
          />
          {
            this.state.loginMessage &&
            <div role="alert">
              <i className="material-icons">warning</i> {this.state.loginMessage} <a href="#" onClick={this.resetPassword.bind(this)} >Forgot Password?</a>
            </div>
          }
        </form>
        <h3>Log in with Facebook</h3>
        <button className='facebook-button' onClick={loginWithFacebook.bind(this)}><i className="fa fa-facebook-square" aria-hidden="true"></i> Facebook</button>
      </div>
    );
  }
}

export default Login;
