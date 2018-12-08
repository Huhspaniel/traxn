import React from "react";
import TrackList from "../Tracklist/TrackList";
import SideProfile from "../SideProfile/SideProfile";

class HomePage extends React.Component {

  state={
    filter: 'following',
    trackList:[]
  }

  getTracks=()=>{

  }

  setFilterPublic = filter => {
    this.setState({
      filter: 'public'
    });
  }

  setFilterFollowing = filter => {
    this.setState({
      filter: 'following'
    });
  }

  render() {
    return(
      <div className="homepage-content">
        <div className="homepage-profile">
          <SideProfile />
        </div>
        <div className="homepage-newsfeed">
        <div className="newsfeed-tabs">
        <p onClick={this.setFilterPublic}>Public</p><p onClick={this.setFilterFollowing}>Following</p>
        </div>
          <TrackList filter={this.state.filter} />
        </div>
      </div>
    );
  }
}

export default HomePage;
