import React from "react";

const SideProfile = props => (
  <div className="side-profile">
    <h1 className="profile-top">Traxn</h1>
    <img className="avatar" src={props.user.imageUrl} alt="profile img" />
    <p id="screen-name">{props.user.displayName}</p>
    <p id="handle">#{props.user.username}</p>
    <div className="record">
      <div className="trackrecord">
        <p className="profile-list">Record</p>
        <p className="profile-stats">1.4m</p>
      </div>
      <div className="tracks">
        <p className="profile-list">Trax</p>
        <p className="profile-stats">{props.user.tracks.length}</p>
      </div>
      <div className="rank">
        <p className="profile-list">Rank</p>
        <p className="profile-stats">33</p>
      </div>
    </div>
  </div>
)



export default SideProfile;
