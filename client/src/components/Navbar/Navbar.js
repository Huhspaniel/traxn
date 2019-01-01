import React from "react";
import { Link } from "react-router-dom";

import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";

const Navbar = props => {
  const path = window.location.pathname;
  return (
    <header className="navbar">
      <nav className="navbar__navigation">
        <div className="navbar__toggle-button">
          <DrawerToggleButton onClick={props.drawerClickHandler} />
        </div>
        <div className="navbar_navigation-items">
          <ul className="nav-left">
            <li>
              <Link to="/" className={path === '/' ? 'active' : ''}>
                <i className="fa fa-home" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/scoreboard" className={path === '/scoreboard' ? 'active' : ''}>
                <i className="fa fa-star" />
                Scoreboard
              </Link>
            </li>
            <li>
              <Link to="/alerts" className={path === '/alerts' ? 'active' : ''}>
                <i className="fa fa-bell" />
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/messages" className={path === '/messages' ? 'active' : ''}>
                <i className="fa fa-envelope" />
                Messages
              </Link>
            </li>
          </ul>

          <ul className="nav-right">
            {props.loggedUser ?
              <div className='nav-link' onClick={e => {
                props.logout();
                props.setRedirect('/signin');
              }}>Sign out</div>
              : <Link to="/signin" className={path === '/signin' ? 'active' : ''}>Sign In | Sign Up</Link>}
            {props.loggedUser ?
              <Link to={`/$${props.loggedUser.username}`} className="avatar">
                <img
                  className="profile-settings"
                  src={props.loggedUser.imageUrl}
                  alt="profile img"
                />
              </Link>
              : ''}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;
