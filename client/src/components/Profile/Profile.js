import React, { Component } from 'react';
import ProfilePage from './ProfilePage';

class Profile extends Component {
    state = {
        user: null
    };

    render() {
        if (!this.state.user) {
            if (this.props.loggedUser) {
                if (this.props.loggedUser.username !== this.props.match.params.username) {
                    this.props.axios
                        .get(`/api/users/${this.props.match.params.username}`)
                        .then(res => {
                            if (res.data.error) {
                                this.props.setRedirect('/');
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
                        if (res.data.error) {
                            this.props.setRedirect('/');
                        } else {
                            this.setState({
                                user: res.data
                            });
                        }
                    })
                    .catch(err => console.error(err));
            }
        }
        return this.props.loggedUser ? (
            this.props.loggedUser.username === this.props.match.params.username ? (
                <ProfilePage
                    {...this.props}
                    user={this.props.loggedUser}
                    isUser={true}
                />
            ) : (
                    <ProfilePage
                        {...this.props}
                        user={this.state.user}
                    />
                )
        ) : (
                <ProfilePage
                    {...this.props}
                    user={this.state.user}
                />
            );
    }
}

export default Profile;