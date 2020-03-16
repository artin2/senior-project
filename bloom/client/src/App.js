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
import ReservationPage from './components/Reservation/ReservationPage'
import './App.css';
import StoreSignupForm from './components/Store/StoreSignupForm';
import Calendar from './components/Calendar/CalendarPage';
import StoreDisplay from './components/Store/StoreDisplay';
import StoreEditForm from './components/Store/StoreEditForm';
import withAuth from './components/withAuth';
import EditProfileForm from './components/User/EditProfileForm';
import Cookies from 'js-cookie';

function App() {
  function handleLogout() {
    Cookies.remove("token");
    window.location.href='/'
  }

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
            <Route exact path="/store" component={withAuth(Calendar)} />
            <Route path="/book/:id" component={ReservationPage} />
            <Route exact path="/store/signup" component={withAuth(StoreSignupForm)} />
            <Route path="/stores/edit/:id" component={withAuth(StoreEditForm)}/>
            <Route path="/stores/:id" component={StoreDisplay}/>
            <Route path="/users/edit/:id" component={withAuth(EditProfileForm)}/>
            <Route path="/logout" component={handleLogout}/>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
