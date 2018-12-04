import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Scoreboard from '../Scoreboard/Scoreboard';
import Alerts from '../Alerts/Alerts';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import Settings from '../Settings/Settings';

const Main = () => (
    <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route path="/scoreboard" component={ Scoreboard } />
        <Route path="/alerts" component={ Alerts } />
        <Route path="/messages" component={ Messages } />
        <Route path="/settings" component={ Settings } />
        <Route path="/profile" component={ Profile } />
    </Switch>
);

export default Main;