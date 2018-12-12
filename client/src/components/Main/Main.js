import React from "react";
import { NavLink } from "react-router";
import { Switch, Route } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import Scoreboard from "../Scoreboard/Scoreboard";
import Alerts from "../Alerts/Alerts";
import Messages from "../Messages/Messages";
import Profile from "../Profile/Profile";
import Settings from "../Settings/Settings";
import Login from "../Login/Login";
import EditProfile from "../EditProfile/EditProfile";

const Main = props => (
  <Switch>
    <Route
      exact
      path="/"
      render={_props => (
        <HomePage
          {..._props}
          user={props.user}
          loggedIn={props.loggedIn}
          setRedirect={props.setRedirect}
        />
      )}
    />
    <Route
      path="/editprofile"
      render={_props => (
        <EditProfile
          {..._props}
          axios={props.axios}
          setRedirect={props.setRedirect}
          user={props.user}
          authJWT={props.authJWT}
        />
      )}
    />
    <Route path="/scoreboard" component={Scoreboard} />
    <Route path="/alerts" 
    render={_props => (
      <Alerts 
      {...props}
      axios = {props.axios}
      user={props.user}

      />
    )}
    />
    <Route path="/messages" component={Messages} />
    <Route path="/settings" component={Settings} />
    <Route
      path="/$:username"
      render={_props => (
        <Profile {..._props} user={props.user} loggedIn={props.loggedIn} />
      )}
    />
    <Route
      path="/signin"
      render={_props => (
        <Login
          {..._props}
          axios={props.axios}
          login={props.login}
          logout={props.logout}
          setRedirect={props.setRedirect}
        />
      )}
    />
  </Switch>
);

export default Main;
