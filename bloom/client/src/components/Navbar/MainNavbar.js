import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './MainNavbar.css'
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom'
import SearchBar from '../Search/SearchBar'

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let storeDisplay = null

    const RenderNavBarBasedOnPageAndUser = (props) => {
      let location = useLocation();
      if(location.pathname == '/search') {
        return <Nav className="full-width">
            <SearchBar className="nav-link"/>
          </Nav>
      }
      if(this.props.user == null || (Object.keys(this.props.user).length === 0 && this.props.user.constructor === Object)) {
        return <Nav className="left">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
        </Nav>
      } else {
        if(this.props.user.role != '0'){
          storeDisplay = <NavDropdown title="Manage Stores" id="basic-nav-dropdown">
            <NavDropdown.Item href={"/users/" + this.props.user.id + "/stores"}>Dashboard</NavDropdown.Item>
            {/* <NavDropdown.Item href="/stores/:store_id/services">Services</NavDropdown.Item> */}
            <NavDropdown.Divider />
            <NavDropdown.Item href="/store/signup">Create Store</NavDropdown.Item>
          </NavDropdown>
        }
        else{
          storeDisplay = <Link to="/store/signup" className="nav-link">Create Store</Link>
        }
        return <Nav>
          {storeDisplay}
          <NavDropdown title="Profile" id="basic-nav-dropdown">
          <NavDropdown.Item href={"/users/" + this.props.user.id}>View</NavDropdown.Item>
            <NavDropdown.Item href={"/users/edit/" + this.props.user.id}>Edit</NavDropdown.Item>
          </NavDropdown>
          <Link to={"/users/" + this.props.user.id + '/appointments'} className="nav-link">My Appointments</Link>
          <Link style={{position: 'absolute', right: 60}} to="/logout" className="nav-link">Logout</Link>
        </Nav>
      }
    }

    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top">
        <Link to="/" className="navbar-brand" style={{fontFamily: 'Megrim, cursive', fontSize: '35px'}}>Bloom</Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="left" style={{marginRight: '120px'}}>
            <Link to="/about" className="nav-link">About</Link>
          </Nav>
          <RenderNavBarBasedOnPageAndUser/>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user
})

export default connect(mapStateToProps)(MainNavbar);
