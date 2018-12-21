import React from "react";

import "./SideDrawer.scss";

const sideDrawer = props => {
  let drawerClasses = ["side-drawer"];
  if (props.show) {
    drawerClasses = ["side-drawer", "open"];
  }
  return (
    <nav className={drawerClasses.join(" ")}>
      <ul>
        <li>
          <a href="/">Home</a>
          <a href="/scoreboard">Scoreboard</a>
          <a href="/alerts">Alerts</a>
          <a href="/messages">Messages</a>
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
        </li>
      </ul>
    </nav>
  );
};

export default sideDrawer;
