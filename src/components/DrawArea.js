import React, { Component } from 'react';
import Immutable from "immutable";
import { SketchPicker } from 'react-color';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
      colorOpen: false,
      clearAllOpen: false,
      strokeColor: 'black'
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.handleColorClick = this.handleColorClick.bind(this);
    this.handleClearAllOpen = this.handleClearAllOpen.bind(this);
    this.handleClearAllClose = this.handleClearAllClose.bind(this);
    this.changeLineColor = this.changeLineColor.bind(this);
  }

  changeLineColor(color, event) {
    const path = document.getElementsByClassName('path');
    let colorString = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    this.setState({strokeColor: colorString});
    try {
      path[path.length].style.stroke = this.state.strokeColor;
    } catch(e) {
    }
  }

  handleColorClick() {
    this.setState({colorOpen: !this.state.colorOpen});
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

    const path = document.getElementsByClassName('path');

    path[path.length - 1].style.stroke = this.state.strokeColor;

    this.setState(prevState => {
      return {
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
      };
    });
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  clearAll() {
    this.setState({lines: new Immutable.List(), clearAllOpen: false});
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
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
        label="Clear All"
        primary={true}
        onTouchTap={this.clearAll}
      />,
    ];

    return (
      <div>
        {
          this.state.colorOpen 
          ? 
            <div className='color-picker'>
              <div className='cover' onClick={this.handleColorClick}/>
              <SketchPicker color={this.state.strokeColor} onChangeComplete={this.changeLineColor} />
            </div>
          : 
            null
        }
        <div className='drawArea' ref='drawArea' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}>
          <Drawing style={{stroke: 'red'}} lines={this.state.lines} />
        </div>
        <span className='button-container'>
          <RaisedButton className='draw-options' primary={true} label='Clear All' onTouchTap={this.handleClearAllOpen}/>
          <RaisedButton className='draw-options' primary={true} label='Change Color' onTouchTap={this.handleColorClick} />
          <RaisedButton className='draw-options' primary={true} label='Change Size' />
          <RaisedButton className='draw-options' primary={true} label='Erase' />
        </span>
        <Dialog
          title='Are you sure you want to clear all?'
          actions={actions}
          modal={true}
          open={this.state.clearAllOpen}
        />
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

export default DrawArea;
