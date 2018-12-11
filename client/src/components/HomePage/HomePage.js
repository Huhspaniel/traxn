import React from "react";
import TrackList from "../Tracklist/TrackList";
import SideProfile from "../SideProfile/SideProfile";
import axios from "axios";

class Dropdown extends React.Component {
  state = {
    showMenu: false
  };
  showMenu = event => {
    event.preventDefault();
    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  };
  closeMenu = () => {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener("click", this.closeMenu);
    });
  };
  selectOption = e => {
    e.preventDefault();
    this.props.handleChange(e);
  };
  render() {
    return (
      <div className={`custom-dropdown ${this.props.className || ""}`}>
        <div className={"button"} onClick={this.showMenu}>
          {this.props.label ? this.props.label + ': ' : ''}{this.props.selected}
        </div>
        <div className={`options${this.state.showMenu ? "" : " hide-menu"}`}>
          {this.props.options.map(option => (
            <option
              data-label={option.label}
              value={option.value}
              onClick={this.selectOption}
            >
              {option.label}
            </option>
          ))}
        </div>
      </div>
    );
  }
}

class HomePage extends React.Component {
  state = {
    filter: "public",
    feed: null,
    value: "",
    content: "",
    sort: "retrax",
    sortLabel: 'Most Shared',
    showMenu: false
  };

  showMenu = event => {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  };

  closeMenu = () => {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener("click", this.closeMenu);
    });
  };

  setSort = e => {
    const sort = e.target.value;
    const sortLabel = e.target.getAttribute('data-label');
    console.log(e.target.name)
    this.setState({ sort, sortLabel });
  };
  sort = tracks => {
    return tracks ? tracks.sort(this[`compare_${this.state.sort}`]) : null;
  };
  a = {
    name: "bill"
  };
  compare_new = ({ _postedAt: a }, { _postedAt: b }) => {
    a = new Date(a).getTime();
    b = new Date(b).getTime();
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  };
  compare_retrax = (a, b) => {
    if (a.repostedBy.length > b.repostedBy.length) {
      return -1;
    } else if (a.repostedBy.length < b.repostedBy.length) {
      return 1;
    } else {
      return this.compare_new(a, b);
    }
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

  handleChange = event => {
    console.log(event.target.name);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handlePost = () => {
    const content = this.state.content;
    this.setState({ content: "" });
    axios
      .post("/api/tracks", { content })
      .then(res => {
        console.log(res);
        this.setState({
          filter: this.state.feed.unshift(res.data)
        });
      })
      .catch(err => console.log(err));
  };

  getPublic = () => {
    axios
      .get(`/api/tracks`)
      .then(res => {
        res.data = this.sort(res.data);
        this.setState({
          feed: res.data || [],
          filter: "public"
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
          filter: "following"
        });
      })
      .catch(err => console.log(err));
  };

  componentWillMount() {
    if (!this.state.feed) {
      if (this.state.filter === "public") {
        this.getPublic();
      } else if (this.state.filter === "following") {
        this.getFollowing();
      }
    }
  }

  render() {
    return (
      <main
        className={`homepage-content${
          this.props.loggedIn ? "" : " logged-out"
        }`}
      >
        {this.props.user ? (
          <div className="homepage-profile">
            <SideProfile user={this.props.user} />
          </div>
        ) : (
          ""
        )}
        <div className="homepage-newsfeed">
          <div className="new-post">
            <img
              className="avatar-img"
              src="https://www.gstatic.com/webp/gallery/1.jpg"
            />

            <textarea
              className="textarea"
              name="content"
              type="text"
              placeholder="What would you like to say?"
              onChange={this.handleChange}
              value={this.state.content}
            />
            <p onClick={this.handlePost} className="post-track">
              Post
            </p>
          </div>

          <div
            className={`newsfeed-tabs ${this.props.user ? "" : "logged-out"}`}
          >
            <p className="public-tab" onClick={this.getPublic}>
              Public
            </p>
            {this.props.user ? (
              <p className="following-tab" onClick={this.getFollowing}>
                Following
              </p>
            ) : (
              ""
            )}
            <Dropdown
              label="Sort"
              options={[
                {
                  label: "Newest",
                  value: "new"
                },
                {
                  label: "Most Shared",
                  value: "retrax"
                }
              ]}
              handleChange={this.setSort}
              selected={this.state.sortLabel}
            />
          </div>
          <TrackList
            feed={this.sort(this.state.feed)}
            setRedirect={this.props.setRedirect}
            loggedIn={this.props.loggedIn}
          />
        </div>
      </main>
    );
  }
}

export default HomePage;
