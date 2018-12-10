import React from "react";
import Repost from "../Repost/Repost";

const Track = props => (
  <div className="track-main">
    <img className="track-img" src={props.userPic} alt={props.userName + ' user picture'} />
    <div className="track-header">
      <p className="track-screen-name">{props.screenName}</p>
      <p className="track-handle">{props.userName}</p>
      <p className="track-timestamp"> ⋅ {props.timeStamp}</p>
    </div>
    <div className="track-content">{props.trackContent}</div>
    <div className="track-buttons">
      <Repost className="repost" />
      <p className="dislike" onClick={props.dislike}>
        <i className="far fa-thumbs-down" />
      </p>
      <p className="direct-message" onClick={props.directMessage}>
        <i className="far fa-envelope" />
      </p>
    </div>
  </div>
);

const TrackList = props => (
  <div className="tracklist">
    {props.feed ?
      props.feed[0] ?
        props.feed.map(track => (console.log(track) ||
          <Track
            screenName={track.user.displayName}
            userPic="https://www.gstatic.com/webp/gallery/1.jpg"
            userName={"#" + track.user.username}
            timeStamp={track._postedAt}
            trackContent={track.content}
            key={track._id}
          />
        ))
        : <span style={{ color: 'black', padding: '20px' }}>No posts :(</span> // <-- Whatever is here is what will be displayed if there are no posts to show
      : '' /* <-- Whatever is here is what will be displayed when posts have not loaded yet */}
  </div>
)

export default TrackList;
