import React, { Component } from 'react';
import LoginMenu from './LoginMenu';

class Login extends Component {
    state = {
        showLogin: true,
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
            showLogin: !this.state.showLogin,
            error: ''
        });
    };

    handleLogin = e => {
        e.preventDefault();
        const credentials = {
            username: this.state.username,
            password: this.state.password
        };
        if (!credentials.username || !credentials.password) {
            this.setState({
                error: 'Please fill out all fields'
            })
        } else {
            this.sendLogin(credentials)
        }
    };
    handleSignup = e => {
        e.preventDefault();
        const info = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            displayName: this.state.displayName,
            confirmPassword: this.state.confirmPassword
        } 
        if (
            !info.username
            || !info.password
            || !info.email
            || !info.displayName
            || !info.confirmPassword
        ) {
            this.setState({
                error: 'Please fill out all fields'
            })
        } else if (info.password !== info.confirmPassword) {
            this.setState({
                error: 'Password fields must match'
            })
        } else if (
            info.password.length < 6
            || info.password.length > 20
            || !info.password.match(/(?=.*[a-z])(?=.*[0-9]).*/i)
        ) {
            this.setState({
                error: 'Password must contain at least one letter and number and be between 6 and 20 characters'
            })
        } else if (!info.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            this.setState({
                error: 'Please enter a valid email'
            })
        } else if (
            info.username.length < 3
            || info.username.length > 18
            || !info.username.match(/^[a-z0-9_-]+$/i)
        ) {
            this.setState({
                error: 'Username can only contain letters, _, and -, and must be between 3 and 18 characters'
            })
        } else if (
            info.displayName.length < 3
            || info.displayName.length > 18
            || !info.displayName.match(/^[a-z'-\s]+$/i)
        ) {
            this.setState({
                error: 'Display name can only include letters, spaces, \', and -, and must be between 3 and 18 characters'
            })
        } else {
            this.sendSignup(info);
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
                    this.setState({
                        error: 'Sorry, that username does not exist.'
                    })
                    this.props.logout();
                } else {
                    this.props.login(res.data.user);
                    this.props.setRedirect('/');
                }
            })
            .catch(err => {
                console.log(err);
                let error;
                if (err.message.includes('401')) {
                    error = 'Incorrect username/password combination. Please try again.';
                } else {
                    error = 'Whoops! Something went wrong :('
                }
                this.setState({ error });
            });
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