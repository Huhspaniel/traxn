import React from "react";

import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import "./Navbar.scss";

const Navbar = props => (
  <header className="navbar">
    <nav className="navbar__navigation">
      <div className="navbar__toggle-button">
        <DrawerToggleButton click={props.drawerClickHandler} />
      </div>
      <div className="navbar__logo">
        <a href="/"></a>
      </div>
      <div className="spacer" />
      <div className="navbar_navigation-items">
        <ul>
          <li>
            <a href="/"><i className="fa fa-home"></i>Home</a>
          </li>
          <li>
            <a href="/scoreboard"><i className="fa fa-star"></i>Scoreboard</a>
          </li>
          <li>
            <a href="/alerts"><i className="fa fa-bell"></i>Alerts</a>
          </li>
          <li>
            <a href="/messages"><i className="fa fa-envelope"></i>Messages</a>
          </li>
          <li>
            <a href="/post"><i className="fa fa-edit"></i>Post</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

export default Navbar;
