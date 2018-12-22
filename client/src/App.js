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
      return <Redirect to={path} />
    }
  };

  getCSRF = () => {
    axios
      .get("/csrf")
      .then(res => {
        axios.defaults.headers.common["csrf-token"] = res.data.csrfToken;
      })
      .catch(err => console.log(err));
  };

  authJWT = () => {
    return axios
      .get('/api/users/me')
      .then(res => {
        if (res.error) {
          this.logout();
        } else {
          this.login(res.data);
        }
      })
      .catch(err => {
        this.logout();
      });
  }

  logout = () => {
    localStorage.clear();
    [0, 1, 2].forEach(num => cookie.remove(`jwt_${num}`));
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
  handleFollow = user_id => {
    const user = this.state.loggedUser;
    user.following = toggleArrayVal(user.following, user_id)
    this.setState({ loggedUser: user });
    axios
      .put(`/api/users/me?action=follow&id=${user_id}`)
      .then(res => {
        if (res.data.error) {
          console.log(res.data.error)
        } else {
          this.authJWT();
        }
      })
      .catch(err => {
        this.logout();
        console.log(err);
      })
  }

  componentWillMount() {
    this.getCSRF();
    if (cookie.get('jwt_0')) {
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
        <SideDrawer show={this.state.sideDrawerOpen} loggedUser={this.state.loggedUser} />
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
