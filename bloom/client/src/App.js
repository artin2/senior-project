import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LoginForm from './components/User/LoginForm';
import SignupForm from './components/User/SignupForm';
import MainNavbar from './components/Navbar/MainNavbar';
import Homepage from './components/Home/Homepage';
import StaticPage from './components/StaticPages/StaticPage';
import SearchDisplay from './components/Search/SearchDisplay';
import VendorPage from './components/Vendor/VendorPage';
import './App.css';


function App() {
  return (
    <div className="App">
      <Router>
        <MainNavbar/>
        <div className="App-body">
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/help" component={StaticPage} />
            <Route exact path="/about" component={StaticPage} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/signup" component={SignupForm} />
            <Route exact path="/search" component={SearchDisplay} />
            <Route exact path="/vendor" component={VendorPage} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
