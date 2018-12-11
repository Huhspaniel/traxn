import React from "react";
import Modal from "react-modal";

const Login = props => (
  <div className="login-signup">
    <div className="menu">
      <p className="menu-title">{
        props.showLogin
          ? 'Login'
          : 'Signup'
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
    displayName: ""
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
    if (this.state.password === this.state.confirmPassword) {
      let signupCredentials = {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        displayName: this.state.displayName
      }
      this.sendSignup(signupCredentials);
    } else {
      throw new Error('Password fields must match');
    }
  }

  sendLogin = credentials => {
    this.props.axios
      .post(`/login`, credentials)
      .then(res => {
        if (res.data.error) {
          console.log(res.data.error);
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
    this.props.axios
      .post(`/api/users`, {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        displayName: this.state.displayName
      })
      .then(res => {
        this.sendLogin(res.data);
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
        />
        {this.state.redirect === "invalidLogin" && <FailedLogIn />}
      </main>
    );
  }
}

export default LoginPage;