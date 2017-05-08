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
       <h1>Onion Sketch</h1>
      </div>
    )
  }
}

export default Home;