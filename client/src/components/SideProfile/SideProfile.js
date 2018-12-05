import React from "react";

const SideProfile = props => (
  // <div className="side-profile">
  //     <img src={props.user.userPic}/>
  //     <h1>{props.user.userHandle}</h1>
  //     <h2>{props.user.userName}</h2>
  //     <h3>Track Record: {props.user.score}</h3>
  // </div>

  <div className="side-profile">
    <h1 className="profile-top">Traxn</h1>
    <img className="avatar" src="https://www.gstatic.com/webp/gallery/1.jpg" />
    <p id="screen-name">John Hancock</p>
    <p id="handle">#JHan99</p>
    <div className="record">
      <div className="trackrecord">
        <p className="profile-list">Record</p>
        <p className="profile-stats">1.4m</p>
      </div>
      <div className="tracks">
        <p className="profile-list">Trax</p>
        <p className="profile-stats">111</p>
      </div>
      <div className="rank">
        <p className="profile-list">Rank</p>
        <p className="profile-stats">33</p>
      </div>
    </div>
  </div>
);

export default SideProfile;
