import React from "react";
import axios from "axios";
// import { ClipLoader } from 'react-spinners';

function formatTime(date) {
  date = new Date(date);
  return date.toLocaleDateString();
}

const TrackStat = props => (
  <div className={`track-stat ${props.name}-wrapper${props.active ? ' active' : ''}`} onClick={props.handleClick}>
      <i className={props.fa} />
      <p className={`${props.name}-count`}>{props.count}</p>
  </div>
)

class Track extends React.Component {
  state = {
    retrax: this.props.repostedBy.length,
    repostedByUser: this.props.repostedBy.includes(localStorage.getItem('id')),
    dislikes: this.props.dislikedBy ? this.props.dislikedBy.length : 0,
    dislikedByUser: this.props.dislikedBy
      ? this.props.dislikedBy.includes(localStorage.getItem('id'))
      : false
  };

  handleRepost = e => {
    this.setState({
      retrax: this.state.repostedByUser ? this.state.retrax - 1 : this.state.retrax + 1,
      repostedByUser: !this.state.repostedByUser
    })
    axios
      .put(`/api/tracks/${this.props.id}?action=repost`)
      .then(res => {
        console.log(res);
        this.setState({
          retrax: res.data.repostedBy.length,
          repostedByUser: res.data.repostedBy.includes(localStorage.getItem('id'))
        });
      })
      .catch(err => console.error(err));
  };
  handleDislike = e => {
    this.setState({
      dislikes: this.state.dislikedByUser ? this.state.dislikes - 1 : this.state.dislikes + 1,
      dislikedByUser: !this.state.dislikedByUser
    })
    axios
      .put(`/api/tracks/${this.props.id}?action=dislike`)
      .then(res => {
        console.log(res);
        this.setState({
          dislikes: res.data.dislikedBy.length,
          dislikedByUser: res.data.dislikedBy.includes(localStorage.getItem('id'))
        });
      })
      .catch(err => console.error(err));
  }

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
            ⋅ {formatTime(this.props._postedAt)}
          </p>
          <p className="direct-message" onClick={this.props.directMessage}>
            <i className="far fa-envelope" />
          </p>
        </div>
        <div className="track-content">{this.props.content}</div>
        <div className="track-buttons">
          <TrackStat
            fa='fa fa-retweet'
            name='repost'
            count={this.state.retrax}
            handleClick={e => {
              if (this.props.loggedIn)
                this.handleRepost(e)
              else
                this.props.setRedirect('/signin')
            }}
            active={this.state.repostedByUser}
          />
          <TrackStat
            fa='far fa-thumbs-down'
            name='dislike'
            count={this.state.dislikes}
            handleClick={e => {
              if (this.props.loggedIn)
                this.handleDislike(e)
              else
                this.props.setRedirect('/signin')
            }}
            active={this.state.dislikedByUser}
          />
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
          <span style={{ color: "black", padding: "20px" }}>No posts here :(</span>
        ) // <-- Whatever is here is what will be displayed if there are no posts to show
    ) : props.user ? (
      props.user.tracks.map(
        track =>
          (
            <Track
              displayName={props.user.displayName}
              userPic={props.user.imageUrl}
              username={props.user.username}
              _postedAt={track._postedAt}
              content={track.content}
              key={track._id}
              id={track._id}
              repostedBy={track.repostedBy || []}
              dislikedBy={track.dislikedBy || []}
              setRedirect={props.setRedirect}
              loggedIn={props.loggedIn}
            />
          )
      )
    ) : (
          ''
        ) /* <-- Whatever is here is what will be displayed when posts have not loaded yet */}
  </div>
);

export default TrackList;
