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
import React, { useEffect, useState } from 'react';
import Apollo from "../../Apollo";
import { Forms, Forms as formsGql } from '../../graphql';
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Button,
} from "reactstrap";

import { dashRoutes } from "routes.js";
import Cookies from 'js-cookie'
import logo from "../../assets/img/pminerals-logo.png";

function DemoNavbar(props) {
  const location1 = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("info");
  const [user, setUser] = useState({});

  
  useEffect(()=>{
    Apollo.query(Forms.getUsersByUUID, {uuid: Cookies.get("user_uuid")}, res => {
      if (res.data) setUser(res.data.users_by_pk);
    });
  },[]);

  const toggle = () => {
    if (isOpen) {
      setColor("info");
    } else {
      setColor("white");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const getBrand = () => {
    var name;
    dashRoutes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === props.location1.pathname) {
            name = prop.name;
          }
          return null;
        });
      } else {
        if (prop.redirect) {
          if (prop.path === props.location1.pathname) {
            name = prop.name;
          }
        } else {
          if (prop.path === props.location1.pathname) {
            name = prop.name;
          }
        }
      }
      return null;
    });
    return name;
  };
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("white");
    } else {
      setColor("info");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
  }, []);
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location1]);

  const Logout = () => {
    Cookies.remove("user_uuid");
    location.reload();
  }

  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar 
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "white"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container>
      <div className="logo">
          <div className="logo-img">
            <img src={logo} width="40px" alt="p-minerals-logo" />
            <p style={{margin:"30px",fontSize:"20px", color:"#0C0B45"}}><b>Pragathi Minerals</b></p>
          </div>
      </div>
      <div style={{margin:"auto"}}>
        {(user.role === "ADMIN" || user.role === "SUPERVISOR" || user.role === "USER") &&
        <p style={{color:"white"}}>{user.role} : {user.username}</p>
        }
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
          {user.role === "ADMIN" &&
          <NavItem className="nav-item">
              <Link to="/admin/daily-stocks" className="nav-link">
                <i className="now-ui-icons business_chart-bar-32" />
                <p>
                  <span className="d-lg-none d-md-block">Daily Stocks</span>
                </p>
              </Link>
            </NavItem>
            }
            {/* <NavItem className="nav-item">
              <Link to="/admin/payments" className="nav-link">
                <i className="now-ui-icons business_money-coins" />
                <p>
                  <span className="d-lg-none d-md-block">Payments</span>
                </p>
              </Link>
            </NavItem>
            <NavItem className="nav-item">
              <Link to="/admin/reciepts" className="nav-link">
                <i className="now-ui-icons files_paper" />
                <p>
                  <span className="d-lg-none d-md-block">Receipts</span>
                </p>
              </Link>
            </NavItem> */}
        
            {user.role === "ADMIN" &&
              <NavItem className="nav-item">
                <Link to="/admin/add-user" className="nav-link">
                  <i className="now-ui-icons users_single-02" />
                  <p>
                    <span className="d-lg-none d-md-block">ADD USERS</span>
                  </p>
                </Link>
              </NavItem>
            }
            {user.role &&
              <Button onClick={Logout}> LOGOUT</Button>
            }
            {/* <Dropdown
              nav
              isOpen={dropdownOpen}
              toggle={(e) => dropdownToggle(e)}
            >
              <DropdownToggle caret nav>
                <i className="now-ui-icons location_world" />
                <p>
                  <span className="d-lg-none d-md-block">Some Actions</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag="a">Action</DropdownItem>
                <DropdownItem tag="a">Another Action</DropdownItem>
                <DropdownItem tag="a">Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default DemoNavbar;
