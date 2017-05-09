import React, { Component } from 'react';
import Immutable from "immutable";

import RaisedButton from 'material-ui/RaisedButton';


class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState(prevState => {
      return {
        lines: prevState.lines.push(new Immutable.List([point])),
        isDrawing: true,
      };
    });
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState(prevState => {
      return {
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
      };
    });
  }

  clearAll() {
    this.setState({lines: new Immutable.List()});
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }
  
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  render() {
    return (
      <div>
        <div className='drawArea' ref="drawArea" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}>
          <Drawing lines={this.state.lines} />
        </div>
        <span className='button-container'>
          <RaisedButton className='draw-options' primary={true} label='Clear All' onTouchTap={this.clearAll}/>
          <RaisedButton className='draw-options' primary={true} label='Change Color' />
          <RaisedButton className='draw-options' primary={true} label='Change Size' />
          <RaisedButton className='draw-options' primary={true} label='Erase' />
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
  const pathData = "M " + line
    .map(p => p.get('x') + ' ' + p.get('y'))
    .join(" L ");

  return <path className='path' d={pathData} />;
}

export default DrawArea;
