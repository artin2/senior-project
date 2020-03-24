import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './MainNavbar.css'
import Cookies from 'js-cookie';
// import store from '../../reduxFolder/store';
// import BasicSearch from '../Search/BasicSearch';

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null
    }

    // NOTE THIS IS NOT WORKING, NAVBAR COMPONENT DOES NOT RERENDER
    // just for ensuring rerender when logged in, not working at the moment
    // might as well just keep track of user using redux at this point?
    // store.subscribe(() => {
    //   // console.log(store.getState().user)
    //   if(store.getState().user){
    //     console.log("HERERERE")
    //     this.setState({
    //       user: store.getState().user
    //     });
    //   }
    // });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // only update chart if the data has changed
  //   if (prevState.user !== this.state.user) {
  //     this.forceUpdate()
  //   }
  // }

  // componentWillUnmount() {
  //   store.unsubscribe()
  // }
  

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
                            <NavDropdown.Item href={"/users/" + this.state.user.id + "/stores"}>Dashboard</NavDropdown.Item>
                            <NavDropdown.Item href="/storeCalendar">Calendar</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/store/signup">Create Store</NavDropdown.Item>
                          </NavDropdown>
                          <NavDropdown title="Profile" id="basic-nav-dropdown">
                          <NavDropdown.Item href={"/users/" + this.state.user.id}>View</NavDropdown.Item>
                            <NavDropdown.Item href={"/users/edit/" + this.state.user.id}>Edit</NavDropdown.Item>
                          </NavDropdown>
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
