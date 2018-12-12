import React from "react";

import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";

const Navbar = props => {
  const path = window.location.pathname;
  return (
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
              <a href="/" className={path === '/' ? 'active' : ''}>
                <i className="fa fa-home" />
                Home
              </a>
            </li>
            <li>
              <a href="/scoreboard" className={path === '/scoreboard' ? 'active' : ''}>
                <i className="fa fa-star" />
                Scoreboard
              </a>
            </li>
            <li>
              <a href="/alerts" className={path === '/alerts' ? 'active' : ''}>
                <i className="fa fa-bell" />
                Alerts
              </a>
            </li>
            <li>
              <a href="/messages" className={path === '/messages' ? 'active' : ''}>
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
              : <a href="/signin" className={path === '/signin' ? 'active' : ''}>Sign in</a>}
  
            {props.user ?
              <a className="avatar" href={`/$${props.user ? props.user.username : localStorage.getItem('username')}`}>
                <img
                  className="profile-settings"
                  src={props.user.imageUrl}
                  alt="profile img"
                />
              </a>
              : ''}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;
