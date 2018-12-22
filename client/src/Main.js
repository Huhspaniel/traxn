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
      {...props}
    />} />
    <Route path="/messages" component={Messages} />
    <Route path="/$:username" render={(_props) =>
      <Profile
        {..._props}
        {...props}
      />
    } />
    <Route
      path="/editprofile"
      render={_props => (
        <EditProfile
          {..._props}
          {...props}
          user={props.loggedUser}
        />
      )}
    />
    <Route path="/scoreboard" component={Scoreboard} />
    <Route path="/alerts"
      render={_props => (
        <Alerts
          {..._props}
          {...props}
        />
      )}
    />
    <Route
      path="/signin"
      render={_props => (!props.loggedUser ?
        <Login
          {..._props}
          {...props}
        />
        : NotFound()
      )}
    />
    <Route path='/*' component={NotFound} />
  </Switch>
);

export default Main;
