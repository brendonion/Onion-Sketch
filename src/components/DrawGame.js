import React, { Component } from 'react';
import Immutable from 'immutable';
import { SketchPicker } from 'react-color';

import {RaisedButton, FlatButton, Slider, Menu, MenuItem, Dialog} from 'material-ui';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import GameTimer from './GameTimer';
import GameOver from './GameOver';


class DrawGame extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
      colorOpen: false,
      clearAllOpen: false,
      sliderOpen: false,
      strokeColor: 'black',
      slider: 5,
      start: false,
      finished: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.handleColorClick = this.handleColorClick.bind(this);
    this.handleClearAllOpen = this.handleClearAllOpen.bind(this);
    this.handleClearAllClose = this.handleClearAllClose.bind(this);
    this.changeLineColor = this.changeLineColor.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.handleSliderOpen = this.handleSliderOpen.bind(this);
    this.handleSliderClose = this.handleSliderClose.bind(this);
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
    this.setState({strokeColor: 'white'});
  }

  handleSliderOpen(event) {
    this.setState({
      sliderOpen: !this.state.sliderOpen,
      anchorEl: event.currentTarget
    });
  }

  handleSliderClose() {
    this.setState({sliderOpen: false});
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

  handleSlider(event, value) {
    this.setState({slider: value});
    const path = document.getElementsByClassName('path');
    try {
      path[path.length].style.strokeWidth = `${this.state.slider}px`;
    } catch(e) {}
  }

  changeLineColor(color, event) {
    const path = document.getElementsByClassName('path');
    let colorString = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    this.setState({strokeColor: colorString});
    try {
      path[path.length].style.stroke = this.state.strokeColor;
    } catch(e) {}
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  clearAll() {
    this.setState({lines: new Immutable.List(), clearAllOpen: false});
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
    this.setState({lines: this.props.lines});
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

    if (!this.state.finished) {
      return (
        <div className='drawing-container'>
          {
          !this.state.start 
          ? 
            <span className='start-container'>
              <RaisedButton secondary={true} label='START GAME' onTouchTap={this.handleStart} />
            </span>
          : 
          <div>
            <GameTimer handleGameFinish={this.handleGameFinish} />
            <div className='drawArea' ref='drawArea' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove}>
              <Drawing lines={this.state.lines} />
            </div>
            <span className='button-container'>
              <RaisedButton className='draw-options' primary={true} label='Clear All' onTouchTap={this.handleClearAllOpen}/>
              <RaisedButton className='draw-options' primary={true} label='Change Color' onTouchTap={this.handleColorClick} />
              <RaisedButton className='draw-options' primary={true} label='Change Size' onTouchTap={this.handleSliderOpen} />
              <RaisedButton className='draw-options' primary={true} label='Erase' onTouchTap={this.handleEraser} />
            </span>
            <Popover
              open={this.state.colorOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'middle', vertical: 'top'}}
              onRequestClose={this.handleColorClick}
              animation={PopoverAnimationVertical}
            >
              <Menu>
                <MenuItem primaryText='Adjust Stroke Color'>
                  <SketchPicker color={this.state.strokeColor} onChangeComplete={this.changeLineColor} />
                  <p>{this.state.strokeColor}</p>
                </MenuItem>
              </Menu>
            </Popover>
            <Popover
              open={this.state.sliderOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'middle', vertical: 'top'}}
              onRequestClose={this.handleSliderClose}
              animation={PopoverAnimationVertical}
            >
              <Menu>
                <MenuItem primaryText='Adjust Stroke Size'>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={this.state.slider}
                    onChange={this.handleSlider}
                  />
                  <p>{this.state.slider}px</p>
                </MenuItem>
              </Menu>
            </Popover>
            <div className='stroke-info'>
              <span className='stroke-container'>
                <i style={{color: this.state.strokeColor, fontSize: `${this.state.slider}px`}} className="fa fa-circle" aria-hidden="true"></i>
              </span>
            </div>
            <Dialog
              title='Are you sure you want to clear it all?'
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
        <GameOver lines={this.state.lines} />
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
