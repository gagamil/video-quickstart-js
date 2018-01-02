import React, { Component } from 'react';

class ActiveRoomControls extends Component{
  render(){
    return(
      <div id="room-controls">
        <p className="instructions">Room Name: {this.props.roomName}</p>
        <button id="button-leave" onClick={this.props.onLeaveRoomClicked} >Leave Room</button>
      </div>
    );
  }
}

export default ActiveRoomControls;