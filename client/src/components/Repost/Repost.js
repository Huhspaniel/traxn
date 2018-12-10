import React from 'react';
    
const Repost = props => (
    <div className="repost-wrapper" onClick={e => { props.handleRepost(props.track_id) }}>
        <i className="fa fa-retweet" />
        <p className="retraxCount">{props.retraxCount}</p>
    </div>
)

export default Repost;