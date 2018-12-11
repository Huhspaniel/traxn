import React from "react";
import axios from "axios";

class SideProfile extends React.Component {
  state = {
    username: '',
    displayName: ''
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

  componentWillMount () {
    this.getUserInfo();
  }

  render() {
    return (
      <div className="side-profile">
    <h1 className="profile-top">Traxn</h1>
    <img className="avatar" src="https://www.gstatic.com/webp/gallery/1.jpg" />
    <p id="screen-name">{this.state.displayName}</p>
    <p id="handle">#{this.state.username}</p>
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
    )
  }
}



export default SideProfile;
