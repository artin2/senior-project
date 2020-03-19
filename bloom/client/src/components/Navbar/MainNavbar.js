import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
// import BasicSearch from '../Search/BasicSearch';
import './MainNavbar.css'
import Cookies from 'js-cookie';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null
    }
  }

  componentDidMount() {
    if(Cookies.get('token') != null) {
      let s = JSON.parse(Cookies.get('user').substring(2))
  
      this.setState({ 
        loggedIn: true,
        user: s
      });
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
                          <NavDropdown title="Manage Stores" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/storeDashboard">Dashboard</NavDropdown.Item>
                            <NavDropdown.Item href="/storeCalendar">Calendar</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/store/signup">Create Store</NavDropdown.Item>
                          </NavDropdown>
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
          </Nav>
          {userComponents}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default MainNavbar;
