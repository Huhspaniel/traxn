import React, { Component } from 'react';
import LoginMenu from './LoginMenu';

class Login extends Component {
    state = {
        showLogin: false,
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        displayName: "",
        error: ""
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    toggleMenu = () => {
        this.setState({
            showLogin: !this.state.showLogin
        });
    };

    handleLogin = e => {
        e.preventDefault();

        let loginCredentials = {
            username: this.state.username,
            password: this.state.password
        };
        this.sendLogin(loginCredentials)
    };
    handleSignup = e => {
        e.preventDefault();
        if (
            !this.state.username
            || !this.state.password
            || !this.state.email
            || !this.state.displayName
            || !this.state.confirmPassword
        ) {
            this.setState({
                error: 'Please fill out all fields'
            })
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                error: 'Password fields must match'
            })
        } else if (
            this.state.password.length < 6
            || this.state.password.length > 20
            || !this.state.password.match(/(?=.*[a-z])(?=.*[0-9]).*/i)
        ) {
            this.setState({
                error: 'Password must contain at least one letter and number and be between 6 and 20 characters'
            })
        } else if (!this.state.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            this.setState({
                error: 'Please enter a valid email'
            })
        } else if (
            this.state.username.length < 3
            || this.state.username.length > 18
            || !this.state.username.match(/^[a-z0-9_-]+$/i)
        ) {
            this.setState({
                error: 'Username can only contain letters, _, and -, and must be between 3 and 18 characters'
            })
        } else if (
            this.state.displayName.length < 3
            || this.state.displayName.length > 18
            || !this.state.displayName.match(/^[a-z'-\s]+$/i)
        ) {
            this.setState({
                error: 'Display name can only include letters, spaces, \', and -, and must be between 3 and 18 characters'
            })
        } else {
            let signupCredentials = {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                displayName: this.state.displayName
            }
            this.sendSignup(signupCredentials);
        }
    }

    sendLogin = () => {
        return this.props.axios
            .post(`/login`, {
                username: this.state.username,
                password: this.state.password
            })
            .then(res => {
                if (res.data.error) {
                    console.log(res.data.error);
                    this.setState({
                        error: 'Incorrect username/password combination'
                    })
                    this.props.logout();
                } else {
                    console.log(res.data);
                    this.props.login(res.data.user);
                    this.props.setRedirect('/');
                }
            })
            .catch(err => console.log(err));
    }
    sendSignup = () => {
        return this.props.axios
            .post(`/api/users`, {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                displayName: this.state.displayName
            })
            .then(res => {
                if (res.data.error) {
                    console.error(res.data.error);
                    if (res.data.error.name === 'ValidationError') {
                        this.setState({
                            error: 'Username and email must be unique'
                        })
                    } else {
                        this.setState({
                            error: res.data.error.message
                        })
                    }
                } else {
                    this.setState({
                        error: ''
                    })
                    this.sendLogin();
                }
            })
            .catch(err => console.log(err));
    };

    render() {
        return (
            <main className="signin-page">
                <LoginMenu
                    toggleMenu={this.toggleMenu}
                    handleSignup={this.handleSignup}
                    handleLogin={this.handleLogin}
                    handleChange={this.handleChange}
                    showLogin={this.state.showLogin}
                    inputs={{
                        username: this.state.username,
                        password: this.state.password,
                        confirmPassword: this.state.confirmPassword,
                        email: this.state.email,
                        displayName: this.state.displayName
                    }}
                    error={this.state.error}
                />
            </main>
        );
    }
}

export default Login;