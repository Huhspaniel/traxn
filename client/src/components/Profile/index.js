import React, { Component } from "react";
import { TrackList } from "..";

function formatTime(date) {
  date = new Date(date);
  return date.toLocaleDateString();
}

const Stat = props => (
  <div className={props.className + " stat"}>
    <div className="stat-name">{props.display}</div>
    <div className="stat-value">{props.stat}</div>
  </div>
);

const Profile = props => {
  if (props.user) {
    const tracks = props.user.tracks ? props.user.tracks.length : 0;
    const reposts = props.user.tracks
      ? props.user.tracks.reduce((traction, { repostedBy }) => {
          traction += repostedBy ? repostedBy.length : 0;
          return traction;
        }, 0)
      : 0;
    const dislikes = props.user.tracks
      ? props.user.tracks.reduce((dislikes, { dislikedBy }) => {
          dislikes += dislikedBy ? dislikedBy.length : 0;
          return dislikes;
        }, 0)
      : 0;
    const traction = reposts - dislikes;
    return (
      <main className="profile-page">
        <div className="profile-header">
          <div className="profile-pic">
            <img className="pic" src={props.user.imageUrl} alt="user avatar" />
          </div>
        </div>

        <div className="profile-bar">
          <div className="stats">
            <Stat className="posts" display="Posts" stat={tracks} />
            <Stat className="traction" display="Traction" stat={traction} />
            <Stat className="reposts" display="Reposts" stat={reposts} />
            <Stat className="dislikes" display="Dislikes" stat={dislikes} />
            {/* <Stat className="rank" display="Rank" stat="33" /> */}
          </div>

          {props.isUser ? (
            <div className="edit-profile">
              <a href="/editprofile">
                <p>Edit Profile</p>
              </a>
            </div>
          ) : (
            <button
              onClick={() => {
                props.handleFollow(props.user._id);
              }}
              className={`follow${
                props.loggedUser
                  ? props.loggedUser.following.includes(props.user._id)
                    ? " active"
                    : ""
                  : ""
              }`}
            >
              <i className="fas fa-user-plus" />
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-profile">
            <div className="profile-names">
              <p className="screen-name">{props.user.displayName}</p>
              <p className="handle">#{props.user.username}</p>
            </div>

            <div className="profile-info">
              {props.user.location ? (
                <p>
                  <i className="fas fa-map-marker-alt" />
                  {props.user.location}
                </p>
              ) : (
                ""
              )}
              {props.user.website ? (
                <p className="website">
                  <i className="fas fa-link" />
                  {props.user.website}
                </p>
              ) : (
                ""
              )}
              <p>
                <i className="far fa-calendar-alt" />
                Joined {formatTime(props.user._joinedAt)}
              </p>
              {props.user.birthday ? (
                <p>
                  <i className="fas fa-birthday-cake" />
                  Born {formatTime(props.user.birthday)}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="profile-newsfeed">
            <TrackList
              user={props.user}
              loggedIn={props.loggedIn}
              setRedirect={props.setRedirect}
            />
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
};

class classProfile extends Component {
  state = {
    user: null
  };

  componentWillMount() {
    if (this.props.loggedUser) {
      if (this.props.loggedUser.username !== this.props.match.params.username) {
        this.props.axios
          .get(`/api/users/${this.props.match.params.username}`)
          .then(res => {
            console.log(res);
            if (res.data.error) {
              // window.location.pathname = '/';
            } else {
              this.setState({
                user: res.data
              });
            }
          })
          .catch(err => console.error(err));
      }
    } else {
      this.props.axios
        .get(`/api/users/${this.props.match.params.username}`)
        .then(res => {
          console.log(res);
          if (res.data.error) {
            // window.location.pathname = '/';
          } else {
            this.setState({
              user: res.data
            });
          }
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    return this.props.loggedUser ? (
      this.props.loggedUser.username === this.props.match.params.username ? (
        <Profile
          user={this.props.loggedUser}
          isUser={true}
          loggedIn={true}
          setRedirect={this.props.setRedirect}
        />
      ) : (
        <Profile
          user={this.state.user}
          loggedUser={this.props.loggedUser}
          handleFollow={this.props.handleFollow}
          loggedIn={true}
          setRedirect={this.props.setRedirect}
        />
      )
    ) : (
      <Profile
        user={this.state.user}
        handleFollow={this.props.handleFollow}
        loggedIn={false}
        setRedirect={this.props.setRedirect}
      />
    );
  }
}

export default classProfile;
