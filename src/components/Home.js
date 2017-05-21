import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';


class Home extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className='home-page'>
        <img className='home-logo' src='./images/Onion-Logo.svg'/>
        <div className='home-header'>
          <h1 className='welcome'>Welcome to Onion Sketch</h1>
        </div>
      </div>
    )
  }
}

export default Home;