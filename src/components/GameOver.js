import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import Immutable from 'immutable';


class GameOver extends React.Component {
  constructor() {
    super();
    this.state = {
      lines: new Immutable.List(),
    };
  }

  componentDidMount() {
    this.setState({lines: this.props.lines});
  }

  render() {
    
    return (
      <div className='drawing-container'>
        <div className='drawArea' ref='drawArea'>
          <Drawing lines={this.state.lines} />
        </div>
        <span className='button-container'>
          <Link to='/home'>
            <RaisedButton className='draw-options' primary={true} >
              <i className="fa fa-home" aria-hidden="true"></i>
            </RaisedButton>
          </Link>
        </span>
      </div>
    );
  } 
}

function Drawing({ lines }) {
  return (
    <svg className='drawing'>
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  );
}

function DrawingLine({ line }) {
  const pathData = 'M ' + line
    .map(p => p.get('x') + ' ' + p.get('y'))
    .join(' L ');

  return <path className='path' d={pathData} />;
}

export default GameOver;
