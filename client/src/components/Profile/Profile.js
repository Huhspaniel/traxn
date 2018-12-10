import React from "react";
import Tracklist from "../Tracklist/TrackList";
import axios from "axios";

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
        <Stat className="trax" display="Trax" stat={props.numberOfTrax} />
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
          <p className="screen-name">{props.displayName}</p>
          <p className="handle">#{props.username}</p>
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

class classProfile extends React.Component {
  state = {
    displayName: '',
    username: '',
    numberOfTrax: 0
    
  }

  getUserInfo = () => {
    axios.get('/api/users/me')
    .then((res) => {
      console.log(res);
      this.setState({
        username: res.data.username,
        displayName: res.data.displayName
      })
    })
  }

  componentWillMount() {
    this.getUserInfo();
  }


  render() {
    return (
      <Profile
      displayName = {this.state.displayName}
      username = {this.state.username}
      />
    )
  }
}


export default classProfile;
