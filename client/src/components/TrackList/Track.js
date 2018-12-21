import React from 'react';
import { Link } from 'react-router-dom';

function formatTime(date) {
    date = new Date(date);
    return date.toLocaleDateString();
}

const TrackStat = props => (
    <div className={`track-stat ${props.name}-wrapper${props.active ? ' active' : ''}`}>
        <i className={props.fa} onClick={props.handleClick} />
        <p className={`${props.name}-count`}>{props.count}</p>
    </div>
)

class Track extends React.Component {
    state = {
        retrax: this.props.repostedBy.length,
        repostedByUser: this.props.repostedBy.includes(localStorage.getItem('id')),
        dislikes: this.props.dislikedBy ? this.props.dislikedBy.length : 0,
        dislikedByUser: this.props.dislikedBy ?
            this.props.dislikedBy.includes(localStorage.getItem('id'))
            : false
    };

    handleRepost = e => {
        this.setState({
            retrax: this.state.repostedByUser ? this.state.retrax - 1 : this.state.retrax + 1,
            repostedByUser: !this.state.repostedByUser
        })
        this.props.axios
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
        this.props.axios
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
                <Link to={`/$${this.props.username}`} className="profile-link">
                    <img
                        className="track-img"
                        src={this.props.userPic}
                        alt={this.props.userName + " user picture"}
                    />
                </Link>
                <div className="track-header">
                    <div className="track-screen-name">{this.props.displayName}</div>
                    <div className="track-handle">
                        #{this.props.username}
                        {" "}
                        ⋅ {formatTime(this.props._postedAt)}
                    </div>
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

export default Track;