/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { Button, Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import Apollo from "../../Apollo";
import { Forms, Forms as formsGql } from '../../graphql';

import logo from "../../assets/img/pminerals-logo.png";
import Cookies from 'js-cookie'

var ps;

function Sidebar(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    Apollo.query(Forms.getUsersByUUID, {uuid: Cookies.get("user_uuid")}, res => {
      if (res.data) setUser(res.data.users_by_pk);
    });
  }, []);

  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  const Logout = () => {
    Cookies.remove("user_uuid");
    location.reload();
  }
  return (
    <div className="sidebar" data-color={props.backgroundColor}>
      <div className="logo">
        <a
          href="/dashboard"
          className="simple-text logo-mini"
          target="_blank"
        >
          <div className="logo-img">
            <img src={logo} alt="p-minerals-logo" />
          </div>
        </a>
        <a
          href="/dashboard"
          className="simple-text logo-normal"
          target="_blank"
        >
          Pragati Minerals
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            if (prop.redirect) return null;
            return (
              <li
                className={
                  activeRoute(prop.layout + prop.path) +
                  (prop.pro ? " active active-pro" : "")
                }
                key={key}
              >
                <NavLink
                  to={prop.layout + prop.path}
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className={"now-ui-icons " + prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
          {user.role === "ADMIN" &&
            <li
                className={activeRoute("/admin/add-user")}
            >
              <NavLink
                to="/admin/add-user"
                className="nav-link"
                activeClassName="active"
              >
                <i className="now-ui-icons users_single-02"/>
                <p>USERS</p>
              </NavLink>
            </li>
          }
           <li
                className="active-pro"
              >
                <a
                  onClick={Logout}
                >
                  <i className="now-ui-icons media-1_button-power" />
                  <p>LOGOUT</p>
                </a>
              </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
