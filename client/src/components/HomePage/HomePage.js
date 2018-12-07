import React from "react";
import TrackList from "../Tracklist/TrackList";
import SideProfile from "../SideProfile/SideProfile";

class HomePage extends React.Component {

  state={
    filter: 'public',
    trackList:[]
  }

  getTracks=()=>{

  }


  render() {
    return(
      <div className="homepage-content">
        <div className="homepage-profile">
          <SideProfile />
        </div>
        <div className="homepage-newsfeed">
          <TrackList filter={this.state.filter} />
        </div>
      </div>
    );
  }
}

export default HomePage;
