import React from "react";

const SideProfile = props => {
  const tracks = props.loggedUser.tracks ? props.loggedUser.tracks.length : 0;
  const reposts = tracks
    ? props.loggedUser.tracks.reduce((reposts, { repostedBy }) => {
      reposts += repostedBy ? repostedBy.length : 0;
      return reposts;
    }, 0)
    : 0;
  const dislikes = tracks
    ? props.loggedUser.tracks.reduce((dislikes, { dislikedBy }) => {
      dislikes += dislikedBy ? dislikedBy.length : 0;
      return dislikes;
    }, 0)
    : 0;
  const traction = reposts - dislikes;
  return (
    <div className="side-profile">
      <div className="profile-top"></div>
      <img className="avatar" src={props.loggedUser.imageUrl} alt="profile img" />
      <div className='profile-name'>
        <div className="display-name">{props.loggedUser.displayName}</div>
        <div className="username">#{props.loggedUser.username}</div>
      </div>
      <div className="profile-bottom"></div>
      <div className="record">
        <div className="tracks">
          <div className="profile-stats">{tracks}</div>
          <div className="profile-list">Tracks</div>
        </div>
        <div className="traction">
          <div className="profile-stats">{traction}</div>
          <div className="profile-list">Traction</div>
        </div>
        {/* <div className="rank">
          <p className="profile-list">Reposts</p>
          <p className="profile-stats">{reposts}</p>
        </div> */}
      </div>
    </div>
  )
}



export default SideProfile;
