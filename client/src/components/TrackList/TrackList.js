import React, { Component } from 'react';
import Feed from './Feed';
import Dropdown from '../HomePage/Dropdown';
// import { ClipLoader } from 'react-spinners';

const sort = (array, compare) => {
  array.sort(compare);
  return array;
};
const unshift = (array, val) => {
  array.unshift(val);
  return array;
};

class TrackList extends Component {
  state = {
    filter: this.props.user ? "user" : "public",
    feed: null,
    value: "",
    content: "",
    sort: "traction",
    sortLabel: "Traction",
    doSortFeed: true
  }

  refreshFeed = () => {
    this[`get_${this.state.filter}`]().then(res => {
      const tracks = sort(res.data.tracks || res.data, this[`compare_${this.state.sort}`]);
      this.setState({
        feed: tracks,
        doSortFeed: false
      });
    });
  };
  get_public = () => {
    return this.props.axios.get(`/api/tracks`);
  };
  get_following = () => {
    return this.props.axios.get(`/api/tracks?filter=following`);
  };
  get_user = () => {
    return this.props.axios.get(`/api/users/${this.props.user._id}`);
  };
  handleSort = e => {
    const sort = e.target.getAttribute('data-value');
    const sortLabel = e.target.getAttribute('data-label');
    this.setState({
      sort,
      sortLabel,
      doSortFeed: true
    });
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
  compare_repost = (a, b) => {
    if (a.repostedBy.length > b.repostedBy.length) {
      return -1;
    } else if (a.repostedBy.length < b.repostedBy.length) {
      return 1;
    } else {
      return this.compare_new(a, b);
    }
  };
  compare_traction = (a, b) => {
    const a_traction = a.repostedBy.length - a.dislikedBy.length;
    const b_traction = b.repostedBy.length - b.dislikedBy.length;
    if (a_traction > b_traction) {
      return -1;
    } else if (a_traction < b_traction) {
      return 1;
    } else {
      return this.compare_new(a, b);
    }
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handlePost = e => {
    e.preventDefault();
    const content = this.state.content;
    this.setState({ content: "" });
    this.props.axios
      .post("/api/tracks", { content })
      .then(res => {
        if (res.data.error) {
          console.error(res.data.error);
        } else {
          this.setState({
            feed: unshift(this.state.feed, res.data),
            doSortFeed: false
          });
        }
      })
      .catch(err => {
        this.props.logout();
        console.log(err);
      });
  };
  handleFilter = e => {
    e.preventDefault();
    const filter = e.target.getAttribute("data-filter");
    this[`get_${filter}`]()
      .then(res => {
        res.data = sort(res.data, this[`compare_${this.state.sort}`]);
        this.setState({
          feed: res.data || [],
          filter,
          doSortFeed: false
        });
      })
      .catch(err => {
        this.props.logout();
        console.log(err);
      });
  };
  render() {
    if (!this.state.feed) {
      this.refreshFeed();
    } else if (this.state.doSortFeed) {
      this.refreshFeed();
    }
    return (
      <div className="tracklist">
        {this.props.loggedUser && !this.props.hidePostMenu ? (
          <div className="new-post">
            <img
              className="avatar-img"
              src={this.props.loggedUser.imageUrl}
              alt="avatar"
            />

            <textarea
              className="textarea"
              name="content"
              type="text"
              placeholder="Say something..."
              onChange={this.handleChange}
              value={this.state.content}
            />
            <p onClick={this.handlePost} className="post-track">
              Post
                                </p>
          </div>
        ) : (
            ""
          )}
        <div
          className={`newsfeed-tabs ${this.props.loggedUser ? "" : "logged-out"}`}
        >
          {!this.props.user ?
            <p
              className={`public-tab${
                this.state.filter === "public" ? " active-filter" : ""
                }`}
              data-filter="public"
              onClick={this.handleFilter}
            >
              Public
          </p> : ''}
          {!this.props.user && this.props.loggedUser ? (
            <p
              className={`following-tab${
                this.state.filter === "following" ? " active-filter" : ""
                }`}
              data-filter="following"
              onClick={this.handleFilter}
            >
              Following
                                </p>
          ) : (
              ""
            )}
          <Dropdown
            label="Sort"
            options={[
              {
                label: "Traction",
                value: "traction"
              },
              {
                label: "Newest",
                value: "new"
              },
              {
                label: "Shares",
                value: "repost"
              }
            ]}
            handleChange={this.handleSort}
            selected={this.state.sortLabel}
          />
        </div>
        <Feed {...this.props} feed={this.state.feed} />
      </div>
    );
  }
}

export default TrackList;
