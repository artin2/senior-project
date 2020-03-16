import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import BasicSearch from '../Search/BasicSearch';
import './MainNavbar.css'
import Cookies from 'js-cookie';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: { id: 1 } // temporary
    }
  }

  componentDidMount() {
    if(Cookies.get('token') != null) {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    let userComponents = null
    if(!this.state.loggedIn) {
      userComponents = <Nav>
                          <Link to="/login" className="nav-link">Login</Link>
                          <Link to="/signup" className="nav-link">Signup</Link>
                       </Nav>
    }
    else {
      userComponents = <Nav>
                          <Link to="/store/signup" className="nav-link">Create Store</Link>
                          <Link to={"/users/edit/" + this.state.user.id} className="nav-link">Edit Profile</Link>
                          <Link to="/logout" className="nav-link">Logout</Link>
                       </Nav>
    }
    return (
      <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" sticky="top">
        <Link to="/" className="navbar-brand">Bloom</Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/help" className="nav-link">Help</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/store" className="nav-link">My Store</Link>
            <Nav.Item className="mr-auto d-none d-sm-block searchBar">
              <BasicSearch/>
            </Nav.Item>
          </Nav>
          {userComponents}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default MainNavbar;
