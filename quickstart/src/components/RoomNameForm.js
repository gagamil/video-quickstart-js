import React, { Component } from 'react';

class RoomNameForm extends Component{
  constructor(props){
    super(props);
    this.state = {roomName:""};
  }

  render(){
    const button = this.state.roomName.length > 0 ? <button className="button" id="button-join" onClick={()=>{this.props.onJoinClicked(this.state.roomName)}}>Join Room</button> : null;
    return(
      <div id="room-controls">
        <p className="instructions">Room Name:</p>
        <input className="input" value={this.state.roomName} onChange={this.roomNameChanged.bind(this)} id="room-name" type="text" placeholder="Enter a room name" />
        {button}
      </div>
    );
  }

  roomNameChanged(e){
    this.setState({roomName:e.target.value});
  }
}

export default RoomNameForm;