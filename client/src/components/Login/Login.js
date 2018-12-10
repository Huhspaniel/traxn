import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
// import cookie from 'react-cookies';

const Login = (props) => (
    <div className="login-div">
        <p onClick={props.toggleHandler}>Login/Sign Up</p>
        <Modal isOpen={props.isActive}>
            <h3>Login</h3>
            <input onChange={props.changeHandler}
                type="text" name="username"
                value={props.userValue} placeholder="username" />
            <input onChange={props.changeHandler}
                type="text" name="password"
                value={props.passValue} placeholder="password" />
            <button className="send-login" onClick={props.loginHandler}>Login</button>

            <br />
            <h4>Or</h4>
            <br />

            <h3>Sign Up</h3>
            <input onChange={props.changeHandler}
                type="text" name="username"
                value={props.value} placeholder="username" />
            <input onChange={props.changeHandler}
                type="text" name="password"
                value={props.value} placeholder="password" />
            <input onChange={props.changeHandler}
                type="text" name="email"
                value={props.value} placeholder="email" />
            <input onChange={props.changeHandler}
                type="text" name="displayName"
                value={props.value} placeholder="display name" />
            <button className="signup-btn" onClick={props.signupHandler}>Sign Up</button>

            <p className="login-btn" onClick={props.toggleHandler}>Close</p>

        </Modal>
    </div>
)


class LoginModal extends React.Component {
    state = {
        isActive: false,
        value: '',
        loggedIn: false,
        accessGranted: false,

        username: '',
        password: '',

        email: '',
        displayName: ''
    }

    sendLogin = () => {
        let loginCredentials = {
            username: this.state.username,
            password: this.state.password
        };

        axios
            .post(`/login`, loginCredentials)
            .then(user => {
                console.log(user);
                
                this.setState({ loggedIn: true });
            })
            .catch(err => console.log(err));
    };

    createUser = () => {
        const token = localStorage.getItem('csrf-token');
        
        console.log(axios.defaults.headers)
        axios
            .post(`/api/users`, {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                displayName: this.state.displayName
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err));
    }

    getToken = () => {
        axios
            .get('/csrf')
            .then((res) => {
                axios.defaults.headers.common['csrf-token'] = res.data.csrfToken;
                console.log(axios.defaults.headers);
                this.setState({ accessGranted: true })
            }).catch(err => console.log(err));
    }

    componentWillMount() {
        Modal.setAppElement('body');
        this.getToken();
    }

    handleToggle = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    handleChange = (event) => {
        console.log(event.target.name)
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className='login-modal'>
                <Login
                    signupHandler={this.createUser}
                    loginHandler={this.sendLogin}
                    isActive={this.state.isActive}
                    toggleHandler={this.handleToggle}
                    changeHandler={this.handleChange} />
            </div>
        );
    }
}

export default LoginModal;