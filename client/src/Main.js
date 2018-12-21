import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  HomePage,
  Scoreboard,
  Alerts,
  Messages,
  Profile,
  Login,
  EditProfile
} from './components';

const NotFound = props => (
  <div style={{ color: 'white', padding: '20px' }}>404 Not Found</div>
)

const Main = (props) => (
  <Switch>
    <Route exact path="/" render={_props => <HomePage
      {..._props}
      loggedUser={props.loggedUser}
      handleFollow={props.handleFollow}
      setRedirect={props.setRedirect}
      axios={props.axios}
    />} />
    <Route path="/messages" component={Messages} />
    <Route path="/$:username" render={(_props) =>
      <Profile {..._props}
        loggedUser={props.loggedUser}
        setRedirect={props.setRedirect}
        handleFollow={props.handleFollow}
        axios={props.axios}
      />} />
    <Route
      path="/editprofile"
      render={_props => (
        <EditProfile
          {..._props}
          axios={props.axios}
          setRedirect={props.setRedirect}
          user={props.loggedUser}
          authJWT={props.authJWT}
        />
      )}
    />
    <Route path="/scoreboard" component={Scoreboard} />
    <Route path="/alerts"
      render={_props => (
        <Alerts
          {...props}
          axios={props.axios}
          user={props.loggedUser}

        />
      )}
    />
    <Route
      path="/signin"
      render={_props => (!props.loggedUser ?
        <Login
          {..._props}
          loggedUser={props.loggedUser}
          axios={props.axios}
          login={props.login}
          logout={props.logout}
          setRedirect={props.setRedirect}
        />
        : NotFound()
      )}
    />
    <Route path='/*' component={NotFound} />
  </Switch>
);

export default Main;
