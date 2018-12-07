import React from "react";
import Tracklist from "../Tracklist/TrackList";

const Stat = props => (
  <div className={props.className + " stat"}>
    <div className="stat-name">{props.display}</div>
    <div className="stat-value">{props.stat}</div>
  </div>
);

const Profile = props => (
  <div className="profile-page">
    <div className="profile-header">
    <div className="profile-pic">
      <img className="pic" src="https://www.gstatic.com/webp/gallery/1.jpg" />
    </div>
    </div>

    <div className="profile-bar">
      <div className="stats">
        <Stat className="trax" display="Trax" stat="111" />
        <Stat className="record" display="Record" stat="1.4m" />
        <Stat className="rank" display="Rank" stat="33" />
        <Stat className="retrax" display="Retrax" stat="33" />
        <Stat className="dislikes" display="Dislikes" stat="16" />
      </div>

      <div className="edit-profile">
        <p>Edit Profile</p>
      </div>
    </div>

    <div className="profile-content">
      <div className="profile-profile">
        <div className="profile-names">
          <p className="screen-name">John Hancock</p>
          <p className="handle">#Jhan99</p>
        </div>

        <div className="profile-info">
          <p>
            <i class="fas fa-map-marker-alt" />
            Los Angeles, CA
          </p>
          <p className="website">
            <i class="fas fa-link" />
            website.johnco
          </p>
          <p>
            <i class="far fa-calendar-alt" />
            Joined June 2020
          </p>
          <p>
            <i class="fas fa-birthday-cake" />
            Born December 25, 2002
          </p>
        </div>
      </div>
      <div className="profile-newsfeed">
        <Tracklist />
      </div>
    </div>
  </div>
);


export default Profile;
