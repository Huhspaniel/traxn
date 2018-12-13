import React from "react";
import Modal from "react-modal";

const Login = props => (
  <div className="login-signup">
    <div className="menu">
      <p className="menu-title">{
        props.showLogin
          ? 'Sign In'
          : 'Create an Account'
      }</p>
      {props.showLogin
        ? (
          <div className="inputs">
            <input
              onChange={props.handleChange}
              type="text"
              name="username"
              value={props.inputs.username}
              placeholder="Username"
            />
            <input
              onChange={props.handleChange}
              type="password"
              name="password"
              value={props.inputs.password}
              placeholder="Password"
            />
          </div>
        ) : (
          <div className="inputs">
            <input
              onChange={props.handleChange}
              type="text"
              name="username"
              value={props.inputs.username}
              placeholder="Username"
            />
            <input
              onChange={props.handleChange}
              type="password"
              name="password"
              value={props.inputs.password}
              placeholder="Password"
            />
            <input
              onChange={props.handleChange}
              type="password"
              name="confirmPassword"
              value={props.inputs.confirmPassword}
              placeholder="Confirm Password"
            />
            <input
              onChange={props.handleChange}
              type="text"
              name="email"
              value={props.inputs.email}
              placeholder="Email"
            />
            <input
              onChange={props.handleChange}
              type="text"
              name="displayName"
              value={props.inputs.displayName}
              placeholder="Display Name"
            />
          </div>
        )}
      <div className={`signin-error${props.error ? '' : ' none'}`}>{props.error ? '*' + props.error : ''}</div>
      <button className="submit-btn"
        onClick={props.showLogin
          ? props.handleLogin
          : props.handleSignup}
      >
        {props.showLogin ? 'Sign in' : 'Sign up'}
      </button>
      <p className="signup-toggle" onClick={props.toggleMenu}>
        {props.showLogin
          ? 'Don\'t have an account? Sign up!'
          : 'Already have an account? Sign in!'}
      </p>
    </div>
  </div>
);

const FailedLogIn = props => (
  <div>
    <h1>Username or Password is Incorrect</h1>
    <p>Please Try Again</p>
  </div>
);

class LoginPage extends React.Component {
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
    } else if (!this.state.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
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

  componentWillMount() {
    Modal.setAppElement("body");
  }

  render() {
    return (
      <main className="signin-page">
        <Login
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
        {this.state.redirect === "invalidLogin" && <FailedLogIn />}
      </main>
    );
  }
}

export default LoginPage;
