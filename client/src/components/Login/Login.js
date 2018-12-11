import React from "react";
import Modal from "react-modal";
import axios from "axios";
import { Redirect } from "react-router-dom";

const Login = props => (
  <div className="login-signup">
    {props.loginMenuBool ? (
      <div className="menu">
        <p className="menu-title">Login</p>
        <div className="inputs">
          <input
            className="user-input"
            onChange={props.changeHandler}
            type="text"
            name="username"
            value={props.userValue}
            placeholder="Username"
          />
          <input
            className="pass-input"
            onChange={props.changeHandler}
            type="password"
            name="password"
            value={props.passValue}
            placeholder="Password"
          />
        </div>
        <button className="submit-btn" onClick={props.loginHandler}>
          Login
        </button>
        <p className="signup-toggle" onClick={props.toggleMenu}>
          Don't have an account? Sign up!
        </p>
      </div>
    ) : (
      <div className="menu">
        <p className="menu-title">Sign Up</p>
        <div className="inputs">
          <input
            className="signupUser-input"
            onChange={props.changeHandler}
            type="text"
            name="username"
            value={props.value}
            placeholder="Username"
          />
          <input
            className="signupPass-input"
            onChange={props.changeHandler}
            type="text"
            name="password"
            value={props.value}
            placeholder="Password"
          />
          <input
            className="email-input"
            onChange={props.changeHandler}
            type="text"
            name="email"
            value={props.value}
            placeholder="Email"
          />
          <input
            className="name-input"
            onChange={props.changeHandler}
            type="text"
            name="displayName"
            value={props.value}
            placeholder="Display Name"
          />
        </div>
        <button className="submit-btn" onClick={props.signupHandler}>
          Sign Up
        </button>
        <p className="signup-toggle" onClick={props.toggleMenu}>
          Already have an account? Sign in!
        </p>
      </div>
    )}
  </div>
);

const FailedLogIn = props => (
  <div>
    <h1>Username or Password is Incorrect</h1>
    <p>Please Try Again</p>
  </div>
);

class LoginModal extends React.Component {
  state = {
    loginMenuBool: true,
    value: "",
    loggedIn: false,
    accessGranted: false,
    redirect: "",

    username: "",
    password: "",

    email: "",
    displayName: ""
  };

  toggleMenu = () => {
    this.setState({
      loginMenuBool: !this.state.loginMenuBool
    });
  };

  setRedirect = event => {
    // event.preventDefault();
    if (!this.state.loggedIn) {
      this.setState({
        redirect: "invalidLogin"
      });
    } else if (this.state.loggedIn) {
      this.setState({
        redirect: "homePage",
        isActive: false
      });
    }
  };

  renderRedirect = () => {
    if (this.state.redirect === "homePage") {
      return <Redirect to="/" />;
    }
  };

  sendLogin = event => {
    // event.preventDefault();
    let loginCredentials = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post(`/login`, loginCredentials)
      .then(res => {
        if (res.data.error) {
          console.log(res.data.error);
          localStorage.removeItem("id");
          this.setState({ loggedIn: false });
          this.setRedirect();
        } else {
          console.log(res.data);
          localStorage.setItem("id", res.data.user_id);
          this.setState({ loggedIn: true });
          this.setRedirect();
        }
      })
      .catch(err => console.log(err));
  };

  createUser = () => {
    const token = localStorage.getItem("csrf-token");

    console.log(axios.defaults.headers);
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
  };

  getToken = () => {
    axios
      .get("/csrf")
      .then(res => {
        axios.defaults.headers.common["csrf-token"] = res.data.csrfToken;
        console.log(axios.defaults.headers);
        this.setState({ accessGranted: true });
      })
      .catch(err => console.log(err));
  };

  componentWillMount() {
    Modal.setAppElement("body");
    this.getToken();
  }

  handleChange = event => {
    console.log(event.target.name);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div className="">
        {this.renderRedirect()}
        <Login
          loginToggler={this.toggleLogin}
          toggleMenu={this.toggleMenu}
          signupHandler={this.createUser}
          loginHandler={this.sendLogin}
          isActive={this.state.isActive}
          toggleHandler={this.handleToggle}
          changeHandler={this.handleChange}
          loginMenuBool={this.state.loginMenuBool}
        />
        {this.state.redirect === "invalidLogin" && <FailedLogIn />}
      </div>
    );
  }
}

export default LoginModal;
