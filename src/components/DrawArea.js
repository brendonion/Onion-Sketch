import React, { Component } from 'react';
import Immutable from 'immutable';
import { SketchPicker } from 'react-color';
import { Redirect } from 'react-router-dom';

import {RaisedButton, FlatButton, Slider, Menu, MenuItem, Dialog} from 'material-ui';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import DrawGame from './DrawGame';
import ShapeTimer from './ShapeTimer';


class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
      strokeColor: 'black',
      slider: 5,
      start: false,
      prepped: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleShapeFinish = this.handleShapeFinish.bind(this);
  }

  handleShapeFinish() {
    this.setState({prepped: true});
  }

  handleStart() {
    this.setState({start: true});
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

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    
    if (!this.state.prepped) {
      return (
        <div className='drawing-container'>
          {
          !this.state.start && !this.state.prepped
          ? 
            <span className='start-container'>
              <RaisedButton secondary={true} label='DRAW A SHAPE' onTouchTap={this.handleStart} />
            </span> 
          : 
          <div>
            <ShapeTimer handleShapeFinish={this.handleShapeFinish} />
            <h3 className='shape-prompt'>Draw a shape quickly!</h3>
            <div className='drawArea' ref='drawArea' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}>
              <Drawing lines={this.state.lines} />
            </div>
          </div>
          }
        </div>
      );
    } else {
      return (
        <DrawGame lines={this.state.lines} />
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

export default DrawArea;
