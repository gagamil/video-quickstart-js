import React, { Component } from 'react';
import {attachTracks} from '../utils';
var Video = require('twilio-video');


class Preview extends Component{
  constructor(props){
    super(props);
    this.preview = this.preview.bind(this);
    this.previewTracks = null;
  }

  componentDidMount(){
    this.props.localDiv(this.localMedia);
  }

  render(){
    return(
      <div className="video-me" ref={(localMedia) => { this.localMedia = localMedia; }}>
        <div className="text">Local video</div>
      </div>
    );
  }

  preview(){
    const localTracksPromise = this.previewTracks
    ? Promise.resolve(previewTracks)
    : Video.createLocalTracks();

    localTracksPromise
    .then((tracks) =>{
      this.previewTracks = tracks;
      const previewContainer = this.localMedia;
      if (!previewContainer.querySelector('video')) {
        attachTracks(tracks, previewContainer);
      }
      this.props.onLocalPreviewStarted(this.previewTracks);
    })
    .catch((error)=> {
      console.error('Unable to access local media', error);
      console.log('Unable to access Camera and Microphone');
    });
  }
}

export default Preview;