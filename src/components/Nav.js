import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

import { logout } from '../helpers/auth.js';
import { firebaseAuth } from '../services/Firebase';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { AppBar } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';


class Nav extends Component {

  render () {
    return (
      <AppBar style={{background: '#d30236'}} title='Onion Sketch' iconElementRight={this.props.authed
          ? 
          <span>
            <span className='user-email'>{this.props.user.email}</span>
            <Link to='/home' className='home-button'><RaisedButton><i className="fa fa-home" aria-hidden="true"></i></RaisedButton></Link>
            <Link to='/canvas' className='canvas-button'><RaisedButton><i className="fa fa-pencil-square-o" aria-hidden="true"></i></RaisedButton></Link>
            <FlatButton
              label='Logout'
              primary={false}
              onTouchTap={() => { logout(); }}
            />
            <Redirect to='/home' />
          </span>
          : 
          <span>
            <Link to='/login'><FlatButton label='Login'/></Link>
            <Link to='/register'><FlatButton label='Register'/></Link>
            <Redirect to='/' />
          </span>
          } iconElementLeft={this.props.authed ? <span><Link to='/home'><i className="fa fa-pencil-square" aria-hidden="true"></i></Link></span> : 
          <span><i className="fa fa-pencil-square" aria-hidden="true"></i></span>}
          iconStyleRight={{margin: '10px'}} iconStyleLeft={{marginTop: '20px'}}>
      </AppBar>
    );
  }
}

export default Nav;
