import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import RoomNameForm from './components/RoomNameForm';
import ActiveRoomControls from './components/ActiveRoomControls';
import Preview from './components/Preview';
import RemoteMedia from './components/RemoteMedia';
import Log from './components/Log';
import {attachParticipantTracks, attachTracks, detachParticipantTracks} from './utils';

var Video = require('twilio-video');


class App extends Component{
  constructor(props){
    super(props);
    this.state = {logs:[], identity:null, room:null};
    this.log = this.log.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.stopLocalTracks = this.stopLocalTracks.bind(this);
    this.myVideoPreviewTracks = null;
  }

  componentDidMount(){
    fetch('/token')
    .then((response)=>{
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((json)=>{
      console.log(json);
      this.setState({identity:json.identity, token:json.token});
    })
    .catch((error)=>{
      console.error(error);
    });
  }

  componentWillUnmount(){
    if(this.state.room){
      this.state.room.disconnect();
    }
  }

  render(){
    const roomControls = this.state.room ? 
        <ActiveRoomControls roomName={this.state.room.name} onLeaveRoomClicked={this.onLeaveClicked.bind(this)} /> 
      : 
        <RoomNameForm onJoinClicked={this.onJoinClicked.bind(this)} />;
    return(
      <div>
        <RemoteMedia room={this.state.room} remoteDiv={(remoteDivContainer)=>{this.setState({remoteDivContainer:remoteDivContainer})}} />
        <div id="controls">
          <Preview localDiv={(localDivContainer)=>{this.setState({localDivContainer:localDivContainer})}} onLocalPreviewStarted={this.onLocalPreviewStarted.bind(this)}/>
          {roomControls}
          <Log logs={this.state.logs}/>
        </div>
      </div>
    );
  }

  onLeaveClicked(){
    this.log('Leaving room...');
    const activeRoom = this.state.room;
    activeRoom.disconnect();
    this.setState({room:null});
  }

  onJoinClicked(roomName){
    this.log("Joining room '" + roomName + "'...");
    var connectOptions = {
      name: roomName,
      logLevel: 'debug'
    };

    if (this.myVideoPreviewTracks) {
      connectOptions.tracks = this.myVideoPreviewTracks;
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(this.state.token, connectOptions)
    .then((room)=>{
      this.roomJoined(room);
    })
    .catch((error)=> {
      this.log('Could not connect to Twilio: ' + error.message);
    });
  }

  roomJoined(room){
    this.log("Joined as '" + this.state.identity + "'");
    this.setState({room:room});

    const previewContainer = this.state.localDivContainer;
    if (!previewContainer.querySelector('video')) {
      attachParticipantTracks(room.localParticipant, previewContainer);
    }

    room.participants.forEach((participant)=> {
      this.log("Already in Room: '" + participant.identity + "'");
      attachParticipantTracks(participant, this.state.remoteDivContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', (participant)=> {
      this.log("Joining: '" + participant.identity + "'");
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant)=> {
      this.log(participant.identity + " added track: " + track.kind);
      attachTracks([track], this.state.remoteDivContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant)=> {
      this.log(participant.identity + " removed track: " + track.kind);
      detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', (participant)=> {
      this.log("Participant '" + participant.identity + "' left the room");
      detachParticipantTracks(participant);
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', ()=> {
      this.log('Left');
      this.stopLocalTracks();
      detachParticipantTracks(room.localParticipant);
      room.participants.forEach(detachParticipantTracks);
      this.setState({room:null});
    });

  }

  log(logMessage){
    const newItem = {logMessage: logMessage, id:Date.now()};
    this.setState(prevState => ({
      logs: prevState.logs.concat(newItem)
    }));
  }

  onLocalPreviewStarted(tracks){
    this.myVideoPreviewTracks=tracks;
  }

  stopLocalTracks(){
    if (this.myVideoPreviewTracks) {
      this.myVideoPreviewTracks.forEach(function(track) {
        track.stop();
      });
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);