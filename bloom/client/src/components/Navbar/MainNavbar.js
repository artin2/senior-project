import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './MainNavbar.css'
import { connect } from 'react-redux';
// import BasicSearch from '../Search/BasicSearch';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let userComponents = null
    let storeDisplay = null

    if(this.props.user == null || (Object.keys(this.props.user).length === 0 && this.props.user.constructor === Object)) {
      console.log(this.props.user)
      userComponents = <Nav className="left">
                          <Link to="/login" className="nav-link">Login</Link>
                          <Link to="/signup" className="nav-link">Signup</Link>
                       </Nav>
    }
    else {
      console.log(this.props.user)
      if(this.props.user.role != '0'){
        storeDisplay = <NavDropdown title="Manage Stores" id="basic-nav-dropdown">
                          <NavDropdown.Item href={"/users/" + this.props.user.id + "/stores"}>Dashboard</NavDropdown.Item>
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
                          <NavDropdown.Item href={"/users/" + this.props.user.id}>View</NavDropdown.Item>
                            <NavDropdown.Item href={"/users/edit/" + this.props.user.id}>Edit</NavDropdown.Item>
                          </NavDropdown>
                          <Link to="/logout" className="nav-link">Logout</Link>
                       </Nav>
    }
    return (
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light" fixed="top">
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

const mapStateToProps = state => ({
  user: state.userReducer.user
})

export default connect(mapStateToProps)(MainNavbar);
