import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';

import { Route, withRouter } from 'react-router'
import { routerReducer, push, routerMiddleware, ConnectedRouter } from 'react-router-redux';

import './styles/App.scss';

import { logout } from './helpers/auth.js';
import { firebaseAuth } from './services/Firebase';
import Nav from './components/Nav';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import DrawArea from './components/DrawArea';
import DrawGame from './components/DrawGame';
import GameOver from './components/GameOver';
import CasualDraw from './components/CasualDraw';


injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      listOfRooms: [],
      room: '',
      roomJoined: false,
      socket: io.connect('http://localhost:3000')
    }
  }

  theDrawArea() {
    return (
      <DrawArea 
        socket={this.state.socket} 
        listOfRooms={this.state.listOfRooms} 
        room={this.state.room}  
        roomJoined={this.state.roomJoined} 
        history={this.props.history}
      />
    );
  }

  componentDidMount() {
    this.setState({
      loading: false
    })
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <MuiThemeProvider>
        <div className='container'>
          <div className='row'>
            <Nav history={this.props.history} />
              <ConnectedRouter history={this.props.history}>
                <div>
                  <Route path='/' exact component={withRouter(Welcome)} />
                  <Route path='/login' component={withRouter(Login)} />
                  <Route path='/register' component={withRouter(Register)} />
                  <Route path='/home' component={withRouter(Home)} />
                  <Route path='/canvas' component={withRouter(this.theDrawArea.bind(this))} />
                  <Route path='/game' component={withRouter(DrawGame)} />
                  <Route path='/gameover' component={withRouter(GameOver)} />
                  <Route path='/casual' component={withRouter(CasualDraw)} />
                </div>
              </ConnectedRouter>
            </div>
          </div>
      </MuiThemeProvider>
    );
  }
}

export default connect (
  state => ({
    router: state.router,
    success: !state.rootReducer.authenticate.didFail,
    loading: state.rootReducer.authenticate.isFetching,
  }),
  dispatch => ({})
)(App)
