import React from "react";
import { TrackList, SideProfile } from '..';

const sort = (array, compare) => {
  array.sort(compare);
  return array;
};
const unshift = (array, val) => {
  array.unshift(val);
  return array;
};

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
          {this.props.label ? this.props.label + ": " : ""}
          {this.props.selected}
        </div>
        <div className={`options${this.state.showMenu ? "" : " hide-menu"}`}>
          {this.props.options.map(option => (
            <option
              data-label={option.label}
              value={option.value}
              onClick={this.selectOption}
              key={option.value + option.label}
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
    sort: "traction",
    sortLabel: "Traction",
    showMenu: false,
    doSortFeed: true
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

  handleSort = e => {
    const sort = e.target.value;
    const sortLabel = e.target.getAttribute("data-label");
    this.setState({
      sort,
      sortLabel,
      doSortFeed: true
    });
  };
  refreshFeed = () => {
    this[`get_${this.state.filter}`]().then(res => {
      res.data = sort(res.data, this[`compare_${this.state.sort}`]);
      this.setState({
        feed: res.data,
        doSortFeed: false
      });
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
      .catch(err => console.error(err.response));
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
      .catch(err => console.log(err));
  };

  get_public = () => {
    return this.props.axios.get(`/api/tracks`);
  };
  get_following = () => {
    return this.props.axios.get(`/api/tracks?filter=following`);
  };

  render() {
    if (!this.state.feed) {
      this.refreshFeed();
    } else if (this.state.doSortFeed) {
      this.refreshFeed();
    }
    return (
      <main
        className={`homepage-content${
          this.props.loggedUser ? "" : " logged-out"
        }`}
      >
        {this.props.loggedUser ? (
          <div className="homepage-profile">
            <SideProfile loggedUser={this.props.loggedUser} />
            <div className="sidebar-list"></div>
          </div>
        ) : (
          ""
        )}
        <div className="homepage-newsfeed">
          {this.props.loggedUser ? (
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
                placeholder="What would you like to say?"
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
            <p
              className={`public-tab${
                this.state.filter === "public" ? " active-filter" : ""
              }`}
              data-filter="public"
              onClick={this.handleFilter}
            >
              Public
            </p>
            {this.props.loggedUser ? (
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
          <TrackList
            feed={this.state.feed}
            setRedirect={this.props.setRedirect}
            loggedUser={this.props.loggedUser}
          />
        </div>
      </main>
    );
  }
}

export default HomePage;
