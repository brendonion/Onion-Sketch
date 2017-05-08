import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { auth } from '../helpers/auth';

function setErrorMsg(error) {
  return {
    registerError: error.message
  }
}

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      registerError: null
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    auth(this.email.getValue(), this.pass.getValue())
      .catch(event => this.setState(setErrorMsg(event)));
  }

  render() {
    return (
      <div className="register-form">
        <h1>Register</h1>
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
            secondary={true}
          />
          {
            this.state.registerError &&
            <div role="alert">
               <i className="material-icons">warning</i> {this.state.registerError}
            </div>
          }
        </form>
      </div>
    )
  }
}

export default Register;
