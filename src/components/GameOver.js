import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import Immutable from 'immutable';


class GameOver extends React.Component {
  constructor() {
    super();
    this.state = {
      lines: new Immutable.List(),
      shape: new Immutable.List(),
      drawingOne: new Immutable.List(),
      drawingTwo: new Immutable.List()
    };
  }

  componentDidMount() {
    this.setState({
      lines: this.props.lines, 
      shape: this.props.shape,
      drawingOne: this.props.drawingOne,
      drawingTwo: this.props.drawingTwo
    });
  }

  // TODO reset game and all the data
  gameReset() {
    console.log('reset!');
  }

  render() {
    
    return (
      <div className='drawing-container'>
        <h3 className='prompt'>Before...</h3>
        <div className='drawArea' ref='drawArea'>
          <Drawing lines={this.state.shape} />
        </div>
        <h3 className='prompt'>After...</h3>
        <span>
          <div className='drawArea' ref='drawArea'>
            <Drawing lines={this.state.drawingOne} />
          </div>
          <div className='drawArea' ref='drawArea'>
            <Drawing lines={this.state.drawingTwo} />
          </div>
        </span>
        <span className='button-container'>
          <Link to='/home'>
            <RaisedButton className='draw-options' primary={true} onTouchTap={this.gameReset}>
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
