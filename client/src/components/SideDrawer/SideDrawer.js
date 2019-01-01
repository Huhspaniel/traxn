import React from "react";
import { Link } from "react-router-dom";

import "./SideDrawer.scss";

const sideDrawer = props => {
  let drawerClasses = ["side-drawer"];
  if (props.isOpen) {
    drawerClasses = ["side-drawer", "open"];
  }
  return (
    <nav className={drawerClasses.join(" ")}>
      <ul>
        <li onClick={props.closeMenu}>
          <Link to="/">
            <i className="fa fa-home" />
            Home
          </Link>
          <Link to="/scoreboard">
            <i className="fa fa-star" />
            Scoreboard
          </Link>
          <Link to="/alerts">
            <i className="fa fa-bell" />
            Alerts
          </Link>
          <Link to="/messages">
            <i className="fa fa-envelope" />
            Messages
          </Link>
          {props.loggedUser ?
            <Link to={`/$${props.loggedUser.username}`}>
              <i className="fa fa-user" />
              Profile
            </Link>
            : null}
          {props.loggedUser ?
            <Link to="/editprofile">
              <i className="fa fa-cog" />
              Settings
            </Link>
            : null}
        </li>
      </ul>
    </nav>
  );
};

export default sideDrawer;
