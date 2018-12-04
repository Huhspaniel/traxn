import React from "react";
import TrackList from "../Tracklist/TrackList";
import SideProfile from "../SideProfile/SideProfile";

const HomePage = props => (
  <div className="homepage-content">
    <div className="homepage-profile">
      <SideProfile/>
    </div>
    <div className="homepage-newsfeed">
      <TrackList/>
    </div>
  </div>
);

export default HomePage;
