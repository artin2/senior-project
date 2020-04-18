import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './MainNavbar.css'
import Cookies from 'js-cookie';
import store from '../../reduxFolder/store';
// import BasicSearch from '../Search/BasicSearch';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null
    }
  }

  componentDidMount() {
    // NOTE: if you refresh the page when logged in, seems that the store user data does not persist
    // so leaving for now, but there's probably a way to just use the cookie or just use redux to 
    // get the user
    store.subscribe(() => {
      if(store.getState().user){
        this.setState({
          user: store.getState().user,
          loggedIn: true
        });
      }
    });

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
    let storeDisplay = null

    if(!this.state.loggedIn) {
      userComponents = <Nav className="left">
                          <Link to="/login" className="nav-link">Login</Link>
                          <Link to="/signup" className="nav-link">Signup</Link>
                       </Nav>
    }
    else {
      if(this.state.user.role != '0'){
        storeDisplay = <NavDropdown title="Manage Stores" id="basic-nav-dropdown">
                          <NavDropdown.Item href={"/users/" + this.state.user.id + "/stores"}>Dashboard</NavDropdown.Item>
                          <NavDropdown.Item href="/storeCalendar">Calendar</NavDropdown.Item>
                          {/* <NavDropdown.Item href="/stores/:store_id/services">Services</NavDropdown.Item> */}
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="/store/signup">Create Store</NavDropdown.Item>
                        </NavDropdown>
      }
      else{
        storeDisplay = <Link to="/store/signup" className="nav-link">Create Store</Link>
      }
      userComponents = <Nav>
                          {storeDisplay}
                          <NavDropdown title="Profile" id="basic-nav-dropdown">
                          <NavDropdown.Item href={"/users/" + this.state.user.id}>View</NavDropdown.Item>
                            <NavDropdown.Item href={"/users/edit/" + this.state.user.id}>Edit</NavDropdown.Item>
                          </NavDropdown>
                          <Link to="/logout" className="nav-link">Logout</Link>
                       </Nav>
    }
    return (
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light" sticky="top" id="navbar">
        <Link to="/" className="navbar-brand" style={{fontFamily: 'Megrim, cursive', fontSize: '35px'}}>Bloom</Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="left" style={{marginRight: '120px'}}>
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
