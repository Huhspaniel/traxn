import React from "react";

const Alert = props => (
  <div className="alert-content">
   

     
      <img src={props.userPic} />
      <div className="message">
      <p className="from-user">Gaining traxn from <span className="username">username{props.fromUser}</span></p>
      <p className="timestamp">⋅ timestamp{props.timeStamp}</p>
      </div>
      
  
  </div>
);

class Alerts extends React.Component {
  state = {
    timeStamp: '',
    userPic: '',
    fromUser: ''
  }

  getRepostedBy = () => {
    
  }

  componentWillMount () {
    this.getRepostedBy();
  }

  render () {
    return (
      <div className="alerts-wrapper">
        <Alert />
      </div>
    );
  };
}

export default Alerts;

