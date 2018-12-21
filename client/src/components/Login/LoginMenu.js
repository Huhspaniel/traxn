import React from "react";

const LoginMenu = props => (
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

export default LoginMenu;
