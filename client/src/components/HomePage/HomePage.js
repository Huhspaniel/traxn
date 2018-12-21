import React from "react";
import { TrackList, SideProfile } from '..';
// import Dropdown from './Dropdown';


class HomePage extends React.Component {
    // state = {
    //     feed: null,
    //     value: "",
    //     content: "",
    //     sort: "traction",
    //     sortLabel: "Traction",
    //     doSortFeed: true
    // };

    render() {
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
                {/* <div className="tracklist">
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
                        axios={this.props.axios}
                    />
                </div> */}
                <TrackList
                    // feed={this.state.feed}
                    setRedirect={this.props.setRedirect}
                    loggedUser={this.props.loggedUser}
                    axios={this.props.axios}
                />
            </main>
        );
    }
}

export default HomePage;
