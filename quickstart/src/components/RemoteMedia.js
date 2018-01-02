import React, { Component } from 'react';


class RemoteMedia extends Component{
  componentDidMount(){
    this.props.remoteDiv(this.remoteMedia);
  }

  render(){
    return(
      <div id="remote-media" ref={(remoteMedia) => { this.remoteMedia = remoteMedia; }}>
      
      </div>
    );
  }
}

export default RemoteMedia;