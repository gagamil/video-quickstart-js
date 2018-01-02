import React, { Component } from 'react';

class Log extends Component{
  render(){
    const logs = this.props.logs.map((log)=>{
      return <MessageElement key={log.id} logMessage={log.logMessage}/>
    });
    return(
      <div id="log">
        {logs}
      </div>
    );
  }
}

export default Log;

function MessageElement(props){
  return <p>{props.logMessage}</p>
}