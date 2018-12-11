import React, { Component } from "react";
import './App.scss';
import Main from './components/Main/Main';
import axios from 'axios';
import cookie from 'js-cookie';

import Navbar from "./components/Navbar/Navbar";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";

class App extends Component {
  state = {
    sideDrawerOpen: false,
    loggedIn: null,
    user: null
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  loginJWT() {
    return axios
      .get('/api/users/me')
      .then(res => {
        if (res.error) {
          localStorage.clear();
          cookie.remove('jwt');
        } else {
          localStorage.setItem('id', res.data._id);
          localStorage.setItem('username', res.data.username);
          this.setState({
            user: res.data
          })
        }
      })
  }

  componentWillMount() {
    this.loginJWT();
  }

  render() {
    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <div style={{ height: "100%" }}>
        <Navbar drawerClickHandler={this.drawerToggleClickHandler} user={this.state.user} />
        <SideDrawer show={this.state.sideDrawerOpen} />
        {backdrop}
        <main style={{ marginTop: "64px" }}>
          <Main user={this.state.user} loggedIn={this.state.loggedIn} />
        </main>
      </div>
    );
  }
}

export default App;
