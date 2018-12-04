import React from "react";
import TrackList from "../Tracklist/TrackList"

const HomePage = props => (
  <div className="homepage-content">
    <div className="homepage-profile">
    
    </div>
    <div className="homepage-newsfeed">
      <TrackList/>
    </div>
  </div>
);

export default HomePage;
