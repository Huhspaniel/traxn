import React from "react";

const Alerts = props => (
  <div className="alerts-content">
    <div className="alerts">

      <div className="from-alert">
      <img src={props.userPic} />
      <p className="from-user">Gaining traxn from {props.fromUser}</p>
      <p className="timestamp">⋅ {props.timeStamp}</p>
      </div>

    </div>
  </div>
);

// class Alerts extends React.Component {
//   state = {

//   }
// }


export default Alerts;

