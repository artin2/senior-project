import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import BasicSearch from '../Search/BasicSearch';
import './MainNavbar.css'

class MainNavbar extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" sticky="top">
        <Link to="/" className="navbar-brand">Bloom</Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/help" className="nav-link">Help</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Nav.Item className="mr-auto d-none d-sm-block searchBar">
              <BasicSearch/>
            </Nav.Item>
          </Nav>
          <Nav>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default MainNavbar;
