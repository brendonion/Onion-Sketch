import React, { Component } from 'react';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './styles/App.scss';

import Nav from './components/Nav';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import DrawArea from './components/DrawArea';
import { logout } from './helpers/auth.js';
import { firebaseAuth } from './services/Firebase';


injectTapEventPlugin();

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      loading: true,
      user: null
    }
  }

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
          user: user
        })
      } else {
        this.setState({
          authed: false,
          loading: false,
          user: null
        })
      }
    })
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <MuiThemeProvider>
        <BrowserRouter>
          <div>
            <Nav authed={this.state.authed} user={this.state.user} />
            <div className='container'>
              <div className='row'>
                <Switch>
                  <Route path='/' exact component={Welcome} />
                  <Route authed={this.state.authed} path='/login' component={Login} />
                  <Route authed={this.state.authed} path='/register' component={Register} />
                  <Route authed={this.state.authed} path='/home' component={Home} />
                  <Route authed={this.state.authed} path='/canvas' component={DrawArea} />
                  <Route render={() => <h3>No Match</h3>} />
                </Switch>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
