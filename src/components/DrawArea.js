import React, { Component } from 'react';
import Immutable from 'immutable';
import { SketchPicker } from 'react-color';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';

import {RaisedButton, FlatButton, Slider, Menu, MenuItem, Dialog, TextField, DropDownMenu} from 'material-ui';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';

import DrawGame from './DrawGame';
import ShapeTimer from './ShapeTimer';

let socket;

class DrawArea extends React.Component {
  constructor() {
    super();
    this.state = {
      isDrawing: false,
      lines: new Immutable.List(),
      strokeColor: 'black',
      slider: 5,
      listOpen: false,
      open: false,
      start: false,
      prepped: false,
      roomJoined: false,
      room: '',
      listOfRooms: []
    };

    socket = io.connect('http://localhost:3000');
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleShapeFinish = this.handleShapeFinish.bind(this);
    this.handleRoomListOpen = this.handleRoomListOpen.bind(this);
    this.handleRoomListClose = this.handleRoomListClose.bind(this);
    this.makeRoom = this.makeRoom.bind(this);
    this.findRoom = this.findRoom.bind(this);
  }

  handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  handleShapeFinish() {
    this.setState({prepped: true});
    console.log('shape done');
    socket.emit('client:finishedShape', { value: this.state.lines });
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

  handleRoomListOpen(event) {
    event.preventDefault();
    this.setState({
      listOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRoomListClose() {
    this.setState({
      listOpen: false
    });
  };

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  // TODO emit the room name and room join to the server 
  // Only let the game begin once the room has 2 people

  // issue with setState(...)
  makeRoom() {
    console.log('rooms', this.state.listOfRooms);
    if ((this.state.listOfRooms).includes(this.title.getValue())) {
      console.log('room already taken');
      return;
    } else {
      this.setState({room: this.title.getValue(), roomJoined: true});
      socket.emit('client:roomCreated', this.title.getValue());
      //this.handleStart();
      this.handleClose();
    }
  }

  findRoom() {
    console.log('Room found!');
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
    this.setState({listOfRooms: this.props.listOfRooms});
    // socket.on('server:connection', (data) => {
    //   this.setState({socketId: data});
    // });
    // socket.on('server:roomCreated', (data) => {
    //   console.log('data', data);
    //   this.state.listOfRooms.push(data)
    //   this.setState({listOfRooms: this.state.listOfRooms});
    // });
    console.log(this.state.listOfRooms);
  }

  componentDidUpdate() {
    socket.on('server:roomCreated', (data) => {
      if ((this.state.listOfRooms).includes(data)) {
        return;
      } else {
        console.log('data', data);
        this.state.listOfRooms.push(data)
        this.setState({listOfRooms: this.state.listOfRooms});
      }
    });
  } 
  
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
    // socket.disconnect();
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.makeRoom}
      />,
    ];

    // TODO get the dropdown menu working ie display all the rooms
    if (!this.state.prepped) {
      return (
        <div className='drawing-container prep-container'>
          {
          !this.state.start //&& !this.state.roomJoined)
          ? 
            <span className='start-container'>
              <RaisedButton secondary={true} label='Create a Room' onTouchTap={this.handleOpen} />
              <RaisedButton secondary={true} label='Join a Room' onTouchTap={this.handleRoomListOpen} />
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
          <Dialog
            title='Make A Room...'
            actions={actions}
            modal={true}
            open={this.state.open}
          >
            <TextField
              id='text-field-default'
              ref={(title) => this.title = title}
            />
          </Dialog>
          <Popover
            open={this.state.listOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRoomListClose}
          >
            <Menu>
              {this.state.listOfRooms.map((room, index) => {
                return <MenuItem key={index} primaryText={room} />
              })}
            </Menu>
          </Popover>
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
