import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import {RaisedButton, FlatButton, Dialog} from 'material-ui';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import GameTimer from './GameTimer';
import GameOver from './GameOver';


class DrawGame extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      shape: new Immutable.List(),
      lines: new Immutable.List(),
      clearAllOpen: false,
      strokeColor: 'black',
      slider: 5,
      start: false,
      finished: false,
      concede: ''
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.handleClearAllOpen = this.handleClearAllOpen.bind(this);
    this.handleClearAllClose = this.handleClearAllClose.bind(this);
    this.handleEraser = this.handleEraser.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleGameFinish = this.handleGameFinish.bind(this);
  }

  handleGameFinish() {
    this.setState({finished: true});
  }

  handleStart() {
    this.setState({start: true});
  }

  handleEraser() {
    this.setState({lines: this.props.lines});
  }

  handleClearAllOpen() {
    this.setState({clearAllOpen: true});
  }

  handleClearAllClose() {
    this.setState({clearAllOpen: false});
  }


  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(prevState => {
      return {
        lines: prevState.lines.push(new Immutable.List([point])),
        isDrawing: true
      };
    });
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    const path = document.getElementsByClassName('path');
    path[path.length - 1].style.stroke = this.state.strokeColor;
    path[path.length - 1].style.strokeWidth = `${this.state.slider}px`;
    this.setState(prevState => {
      return {
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
      };
    });
  }

  handleMouseUp() {
    this.setState({isDrawing: false});
  }

  clearAll() {
    this.setState({lines: new Immutable.List(), clearAllOpen: false, concede: 'You have conceded.'});
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }


  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
    this.setState({lines: this.props.lines, shape: this.props.lines});
  }
  
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.handleClearAllClose}
      />,
      <FlatButton
        label="Concede"
        primary={true}
        onTouchTap={this.clearAll}
      />,
    ];

    if (!this.state.finished) {
      return (
        <div className='drawing-container'>
          {
          !this.state.start 
          ? <div>
              <span className='start-container'>
                <RaisedButton secondary={true} label='START GAME' onTouchTap={this.handleStart} />
              </span>
              <div className='draw-prep'>
                <Drawing lines={this.state.lines} />
              </div>
            </div>
          : 
          <div>
            <GameTimer handleGameFinish={this.handleGameFinish} />
            <div className='drawArea' ref='drawArea' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}>
              <Drawing lines={this.state.lines} />
            </div>
            <span className='button-container'>
              <RaisedButton className='draw-options' primary={true} label='Concede' onTouchTap={this.handleClearAllOpen}/>
              <RaisedButton className='draw-options' primary={true} label='Reset' onTouchTap={this.handleEraser} />
            </span>
            <Dialog
              title='Are you sure you want to give up?'
              actions={actions}
              modal={true}
              open={this.state.clearAllOpen}
            />
          </div>
          }
        </div>
      );
    } else {
      return (
        <GameOver lines={this.state.lines} shape={this.state.shape} />
      );
    }
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

export default DrawGame;
