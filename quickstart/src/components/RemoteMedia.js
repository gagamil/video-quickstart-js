import React, { Component } from 'react';


class RemoteMedia extends Component{
  componentDidMount(){
    this.props.remoteDiv(this.remoteMedia);
  }

  render(){
    return(
      <div className="video-user" ref={(remoteMedia) => { this.remoteMedia = remoteMedia; }}>
        <div className="text">Remote video</div>
      </div>
    );
  }
}

export default RemoteMedia;