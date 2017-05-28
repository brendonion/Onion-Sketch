import React, { Component } from 'react';

import { logout } from '../helpers/auth.js';
import firebase from 'firebase';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { AppBar } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';


class Nav extends Component {
  constructor() {
    super();
    this.state = {
      authed: false,
      user: null
    };
  }

  home() {
    this.props.history.push('/home');
  }

  drawGame() {
    this.props.history.push('/canvas');
  }

  casual() {
    this.props.history.push('/casual')
  }

  login() {
    this.props.history.push('/login');
  }

  register() {
    this.props.history.push('/register')
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({
          authed: true,
          user: user,
        })
      } else {
        this.setState({
          authed: false,
          user: null
        })
        this.props.history.push('/');
      }
    });
  }

  render () {
    return (
      <AppBar style={{background: '#d30236'}} title='Onion Sketch' iconElementRight={this.state.authed
        ? 
        <span>
          <span className='user-email'>{this.state.user.email}</span>
          <span className='home-button'><RaisedButton onTouchTap={this.home.bind(this)}><i className="fa fa-home" aria-hidden="true"></i></RaisedButton></span>
          <span className='casual-button'><RaisedButton onTouchTap={this.casual.bind(this)}><i className="fa fa-coffee" aria-hidden="true"></i></RaisedButton></span>
          <span className='canvas-button'><RaisedButton onTouchTap={this.drawGame.bind(this)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></RaisedButton></span>
          <FlatButton
            className='logout-button'
            label='Logout'
            primary={false}
            onTouchTap={() => { logout(); }}
          />
        </span>
        : 
        <span>
          <span><FlatButton label='Login' onTouchTap={this.login.bind(this)}/></span>
          <span><FlatButton label='Register' onTouchTap={this.register.bind(this)}/></span>
        </span>
        } iconElementLeft={this.state.authed 
          ? 
          <span><img className='logo' src='./images/Onion-Logo.svg'/></span> 
          : 
          <span><img className='logo' src='./images/Onion-Logo.svg'/></span>}
          iconStyleRight={{margin: '10px'}} iconStyleLeft={{marginTop: '8px'}}>
      </AppBar>
    );
  }
}

export default Nav;
