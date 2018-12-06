import React from "react";
import Axios from "axios";
import "../Tracklist/Tracklist.scss";

const Track = props => (
  <div className="track-main">
    <img className="track-img" src={props.userPic} />
    <div className="track-header">
        <p id="track-screen-name">{props.screenName}</p>
        <p id="track-handle">{props.userName}</p>
        <p id="track-timestamp"> ⋅ {props.timeStamp}</p>
      </div>
    <div className="track-content">
      {props.TrackContent}
    </div>
    <div className="track-buttons">
      <p className="repost" onClick={props.repost}><i class="fa fa-retweet"></i></p>
      <p className="dislike" onClick={props.dislike}><i class="far fa-thumbs-down"></i></p>
      <p className="direct-message" onClick={props.directMessage}><i class="far fa-envelope"></i></p>
    </div>
  </div>
);

class TrackList extends React.Component {
  state = {
    followingPosts: TrackList
  };

  getTracks = () => {
    Axios.get();
  };

  render() {
    return (
      // <div>
      //     {this.state.followingPosts.map((post, i)=>(
      // <Track
      // key={i}
      // TrackContent={post.text}
      // userPic={post.profilePic}
      // dislike={this.dislike}
      // repost={this.repost} />
      //     ))}

      // </div>
      <div className='tracklist'>
        <Track
          key="test"
          screenName="John Hancock"
          userName="#jHan99"
          timeStamp = '24m'
          TrackContent="The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'"
          userPic="https://www.gstatic.com/webp/gallery/1.jpg"
        />
        <Track
          key="test"
          screenName="John Hancock"
          userName="#jHan99"
          timeStamp = '24m'
          TrackContent="The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'"
          userPic="https://www.gstatic.com/webp/gallery/1.jpg"
        />
        <Track
          key="test"
          screenName="John Hancock"
          userName="#jHan99"
          timeStamp = '24m'
          TrackContent="The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'"
          userPic="https://www.gstatic.com/webp/gallery/1.jpg"
        />
        <Track
          key="test"
          screenName="John Hancock"
          userName="#jHan99"
          timeStamp = '24m'
          TrackContent="The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'"
          userPic="https://www.gstatic.com/webp/gallery/1.jpg"
        />
      </div>
    );
  }
}

export default TrackList;
