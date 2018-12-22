import React from "react";
import Track from "./Track"
// import { ClipLoader } from 'react-spinners';

const Feed = props => (
    <div className="feed">
        {props.feed ? (
            props.feed[0] ? (
                props.feed.map(
                    track =>
                        (
                            <Track
                                {...props.user}
                                {...props}
                                displayName={(props.user || track.user).displayName}
                                userPic={(props.user || track.user).imageUrl}
                                username={(props.user || track.user).username}
                                _postedAt={track._postedAt}
                                content={track.content}
                                key={track._id}
                                id={track._id}
                                repostedBy={track.repostedBy}
                                dislikedBy={track.dislikedBy}
                                setRedirect={props.setRedirect}
                                loggedIn={!!props.loggedUser}
                                axios={props.axios}
                            />
                        )
                )
            ) : (
                    <span style={{ color: "black", padding: "20px" }}>No posts here :(</span>
                ) // <-- Whatever is here is what will be displayed if there are no posts to show
        ) : (
                ''
            ) /* <-- Whatever is here is what will be displayed when posts have not loaded yet */}
    </div>
);

export default Feed;
