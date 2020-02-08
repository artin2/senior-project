import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import BasicSearch from '../Search/BasicSearch';
import './ResponsiveNavbar.css'

class ResponsiveNavbar extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="#home">Bloom</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#help">Help</Nav.Link>
            <Nav.Link href="#aboutus">About</Nav.Link>
            <Nav.Item className="mr-auto d-none d-sm-block">
              <BasicSearch/>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Link href="#login">Login</Nav.Link>
            <Nav.Link href="#signup">Signup</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default ResponsiveNavbar;
