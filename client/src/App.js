import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
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
    user: null,
    redirect: null
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  setRedirect = path => {
    this.setState({
      redirect: path
    })
  };

  renderRedirect = () => {
    if (this.state.redirect && this.state.redirect !== window.location.pathname) {
      const path = this.state.redirect;
      return <Redirect to={path} />
    }
  };

  getCSRF = () => {
    axios
      .get("/csrf")
      .then(res => {
        axios.defaults.headers.common["csrf-token"] = res.data.csrfToken;
        console.log(axios.defaults.headers);
        this.setState({ accessGranted: true });
      })
      .catch(err => console.log(err));
  };

  authJWT = () => {
    return axios
      .get('/api/users/me')
      .then(res => {
        if (res.error) {
          console.log(res.error);
          this.logout();
        } else {
          this.login(res.data);
        }
      })
      .catch(err => {
        this.logout();
        console.error(err.response);
      });
  }

  logout = () => {
    localStorage.clear();
    cookie.remove('jwt');
    this.setState({
      user: null,
      loggedIn: false
    })
  }
  login = user => {
    localStorage.setItem('id', user._id);
    localStorage.setItem('username', user.username);
    this.setState({
      user: user,
      loggedIn: true
    })
  }

  componentWillMount() {
    this.getCSRF();
    if (cookie.get('jwt')) {
      this.authJWT();
    }
  }

  render() {
    let backdrop;
    console.log('Rendering app...')

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <div className="global-page">
        <Navbar
          drawerClickHandler={this.drawerToggleClickHandler}
          user={this.state.user}
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          axios={axios}
          setRedirect={this.setRedirect}
        />
        <SideDrawer show={this.state.sideDrawerOpen} />
        {this.renderRedirect()}
        <Main
          user={this.state.user} axios={axios}
          loggedIn={this.state.loggedIn}
          login={this.login} logout={this.logout}
          setRedirect={this.setRedirect}
        />
        {window.location.pathname !== '/signin' ? <footer>
          Copyright ©
        </footer> : ''}
        {backdrop}
      </div>
    );
  }
}

export default App;
