import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import './App.scss';
import Main from './Main';
import axios from 'axios';
import cookie from 'js-cookie';

import Navbar from "./components/Navbar";
import SideDrawer from "./components/SideDrawer";
import Backdrop from "./components/Backdrop";

function toggleArrayVal(array, value) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
  return array;
}

class App extends Component {
  state = {
    sideDrawerOpen: false,
    loggedUser: null,
    redirect: null,
    checkedLogin: false
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
      this.setState({
        redirect: null
      });
      return <Redirect to={path} />
    }
  };

  getCSRF = async () => {
    try {
      const res = await axios.get("/csrf");
      
      axios.defaults.headers.common["csrf-token"] = res.data.csrfToken;
    } catch (err) {
      console.error(err)
    }
  };

  authJWT = async () => {
    try {
      const res = await axios.get('/api/users/me');

      if (res.error) {
        this.logout();
      } else {
        this.login(res.data);
      }
    } catch (err) {
      this.logout();
    }
  }

  logout = () => {
    localStorage.clear();
    cookie.remove('jwt');
    this.setState({
      loggedUser: null,
      checkedLogin: true
    })
  }
  login = user => {
    localStorage.setItem('id', user._id);
    localStorage.setItem('username', user.username);
    this.setState({
      loggedUser: user,
      checkedLogin: true
    })
  }
  handleFollow = async (user_id) => {
    const user = this.state.loggedUser;
    user.following = toggleArrayVal(user.following, user_id)
    this.setState({ loggedUser: user });

    try {
      const res = await axios
        .put(`/api/users/me?action=follow&id=${user_id}`);

      if (res.data.error) {
        console.log(res.data.error)
      } else {
        this.authJWT();
      }
    } catch (err) {
      this.logout();
      console.error(err);
    }
  }

  componentWillMount() {
    if (!axios.defaults.headers.common["csrf-token"]) {
      this.getCSRF();
    }
    if (cookie.get('jwt')) {
      this.authJWT();
    } else {
      this.logout();
    }
  }

  render() {
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (this.state.checkedLogin ?
      <div className="global-page">
        <Navbar
          drawerClickHandler={this.drawerToggleClickHandler}
          loggedUser={this.state.loggedUser}
          logout={this.logout}
          axios={axios}
          setRedirect={this.setRedirect}
        />
        <SideDrawer closeMenu={this.backdropClickHandler} isOpen={this.state.sideDrawerOpen} loggedUser={this.state.loggedUser} />
        {this.renderRedirect()}
        <Main
          loggedUser={this.state.loggedUser} axios={axios}
          login={this.login} logout={this.logout}
          setRedirect={this.setRedirect}
          authJWT={this.authJWT}
          handleFollow={user_id => {
            if (this.state.loggedUser) {
              this.handleFollow(user_id);
            } else {
              this.setRedirect('/signin');
            }
          }}
        />
        {/* {window.location.pathname !== '/signin' ?  : ''} */}
        <footer>
          Copyright © Traxn 2018
        </footer>
        {backdrop}
      </div>
      : '');
  }
}

export default App;
