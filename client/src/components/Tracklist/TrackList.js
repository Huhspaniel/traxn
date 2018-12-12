import React from "react";
import Repost from "../Repost/Repost";
import axios from "axios";
// import { ClipLoader } from 'react-spinners';

function formatTimestamp(date) {
  date = new Date(date);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

class Track extends React.Component {
  state = {
    retrax: this.props.repostedBy.length,
    repostedByUser: this.props.repostedBy.includes(localStorage.getItem('id'))
  };

  handleRepost = track_id => {
    this.setState({
      retrax: this.state.repostedByUser ? this.state.retrax - 1 : this.state.retrax + 1,
      repostedByUser: !this.state.repostedByUser
    })
    axios
      .put(`/api/tracks/${track_id}?action=repost`)
      .then(res => {
        console.log(res);
        this.setState({
          retrax: res.data.repostedBy.length,
          repostedByUser: res.data.repostedBy.includes(localStorage.getItem('id'))
        });
      })
      .catch(err => console.error(err));
  };

  render() {
    return (
      <div className="track-main" data-id={this.props.id}>
        <a href={`/$${this.props.username}`}>
          <img
            className="track-img"
            src={this.props.userPic}
            alt={this.props.userName + " user picture"}
          />
        </a>
        <div className="track-header">
          <p className="track-screen-name">{this.props.displayName}</p>
          <p className="track-handle">#{this.props.username}</p>
          <p className="track-timestamp">
            {" "}
            ⋅ {formatTimestamp(this.props._postedAt)}
          </p>
        </div>
        <div className="track-content">{this.props.content}</div>
        <div className="track-buttons">
          <Repost
            track_id={this.props.id}
            retraxCount={this.state.retrax}
            handleRepost={track_id => {
              if (this.props.loggedIn)
                this.handleRepost(track_id)
              else
                this.props.setRedirect('/signin')
            }}
            active={this.state.repostedByUser}
          />

          <p className="dislike" onClick={this.props.dislike}>
            <i className="far fa-thumbs-down" />
          </p>
          <p className="direct-message" onClick={this.props.directMessage}>
            <i className="far fa-envelope" />
          </p>
        </div>
      </div>
    );
  }
}

const TrackList = props => (
  <div className="tracklist">
    {props.feed ? (
      props.feed[0] ? (
        props.feed.map(
          track =>
            (
              <Track
                displayName={track.user.displayName}
                userPic={track.user.imageUrl}
                username={track.user.username}
                _postedAt={track._postedAt}
                content={track.content}
                key={track._id}
                id={track._id}
                repostedBy={track.repostedBy}
                setRedirect={props.setRedirect}
                loggedIn={props.loggedIn}
              />
            )
        )
      ) : (
          <span style={{ color: "black", padding: "20px" }}>No posts :(</span>
        ) // <-- Whatever is here is what will be displayed if there are no posts to show
    ) : (''
        // <ClipLoader />
      ) /* <-- Whatever is here is what will be displayed when posts have not loaded yet */}
  </div>
);

export default TrackList;
