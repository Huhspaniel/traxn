import React from "react";
import TrackList from "../Tracklist/TrackList";
import SideProfile from "../SideProfile/SideProfile";
import axios from 'axios';

class HomePage extends React.Component {
  state = {
    filter: 'public',
    feed: null
  }

  /*
    /api/tracks?period={unit},{quantity}&u={userid},{userid}...
        Gets all tracks, filtering based on time period, and
        specific users. If {period} is not defined, gets tracks for
        all time. If {u} is not defined, gets tracks for all users.
        
        For example, if {period} = 'week,3', will only get tracks 
        from past 3 weeks. If {u} = 'user1_id,user2_id,user3_id'
        will only get tracks posted by user1, user2, user3.


    /api/tracks/following?period={unit},{quantity}
        Only gets tracks posted by those a user is following.
        Only accessible when user is logged in using JWT authentication.
        The JWT token will automatically be stored in cookies upon login.
  */

  getPublic = () => {
    axios
      .get(`/api/tracks`)
      .then(res => {
        this.setState({
          feed: res.data || [],
          filter: 'public'
        });
      })
      .catch(err => console.log(err));
  };
  getFollowing = () => {
    axios
      .get(`/api/tracks/following`)
      .then(res => {
        this.setState({
          feed: res.data || [],
          filter: 'following'
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    if (!this.state.feed) {
      if (this.state.filter === "public") {
        this.getPublic();
      } else if (this.state.filter === "following") {
        this.getFollowing();
      }
    }

    return (
      <main className={`homepage-content${this.props.loggedIn ? '' : ' logged-out'}`}>
        {this.props.user ? <div className="homepage-profile">
          <SideProfile user={this.props.user} />
        </div> : ''}
        <div className="homepage-newsfeed">
          <div className="newsfeed-tabs">
            <p onClick={this.getPublic}>Public</p>
            {this.props.user ? <p onClick={this.getFollowing}>Following</p> : ''}
          </div>
          <TrackList feed={this.state.feed} setRedirect={this.props.setRedirect} loggedIn={this.props.loggedIn} />
        </div>
      </main>
    );
  }
}

export default HomePage;
