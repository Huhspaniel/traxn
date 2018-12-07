import React from "react";
import axios from "axios";
import "../Tracklist/Tracklist.scss";

const Track = props => (
  <div className="track-main">
    <img className="track-img" src={props.userPic} />
    <div className="track-header">
      <p id="track-screen-name">{props.screenName}</p>
      <p id="track-handle">{props.userName}</p>
      <p id="track-timestamp"> ⋅ {props.timeStamp}</p>
    </div>
    <div className="track-content">{props.trackContent}</div>
    <div className="track-buttons">
      <p className="repost" onClick={props.repost}>
        <i className="fa fa-retweet" />
      </p>
      <p className="dislike" onClick={props.dislike}>
        <i className="far fa-thumbs-down" />
      </p>
      <p className="direct-message" onClick={props.directMessage}>
        <i className="far fa-envelope" />
      </p>
    </div>
  </div>
);

axios
      .get(`/api/tracks`)
      .then(res => {
        console.log(res.data);
        // this.setState({ feed: tracks });
      })
      .catch(err => console.log(err));

class TrackList extends React.Component {
  state = {
    feed: []
  };

  getPublic = () => {
    axios
      .get(`/api/tracks`)
      .then(res => {
        this.setState({ feed: res.data });
      })
      .catch(err => console.log(err));
  };
  getFollowing = () => {
    axios
      .get(`/api/tracks/following`)
      .then(res => {
        this.setState({ feed: res.data });
      })
      .catch(err => console.log(err));
  };

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

  render() {
    if (!this.state.feed[0]) {
      if (this.props.filter === "public") {
        this.getPublic();
      } else if (this.props.filter === "following") {
        this.getFollowing();
      }
    }

    return (
      <div className="tracklist">
        {this.state.feed.map(track => (
          <Track
            screenName={track.user.name.first + track.user.name.last}
            userPic="https://www.gstatic.com/webp/gallery/1.jpg"
            userName={"#" + track.user.username}
            timeStamp={track._postedAt}
            trackContent={track.content}
            key={track._id}
          />
        ))}
      </div>
    );
  }
}

export default TrackList;
