import React from "react";

import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import PostModal from "../Post/Post";

const Navbar = props => (
  <header className="navbar">
    <nav className="navbar__navigation">
      <div className="navbar__toggle-button">
        <DrawerToggleButton click={props.drawerClickHandler} />
      </div>
      <div className="navbar__logo">
        <a href="/" />
      </div>
      <div className="spacer" />
      <div className="navbar_navigation-items">
        <ul className="nav-left">
          <li>
            <a href="/">
              <i className="fa fa-home" />
              Home
            </a>
          </li>
          <li>
            <a href="/scoreboard">
              <i className="fa fa-star" />
              Scoreboard
            </a>
          </li>
          <li>
            <a href="/alerts">
              <i className="fa fa-bell" />
              Alerts
            </a>
          </li>
          <li>
            <a href="/messages">
              <i className="fa fa-envelope" />
              Messages
            </a>
          </li>
        </ul>

        <ul className="nav-right">
          {props.loggedIn || localStorage.getItem('id') ?
            <div className='nav-link' onClick={e => {
              props.logout();
              props.setRedirect('/signin');
            }}>Sign out</div>
            : <a href="/signin">Sign in</a>}
          {props.loggedIn || localStorage.getItem('id') ?
            <a className="avatar" href={`/$${props.user ? props.user.username : localStorage.getItem('username')}`}>
              <img
                className="profile-settings"
                src="https://www.gstatic.com/webp/gallery/1.jpg"
                alt="profile img"
              />
            </a>
            : ''}
        </ul>
      </div>
    </nav>
  </header>
)

export default Navbar;
