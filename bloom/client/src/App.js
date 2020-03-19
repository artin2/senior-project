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
import redirectWithoutAuth from './components/redirectWithoutAuth';
import redirectWithAuth from './components/redirectWithAuth';
import EditProfileForm from './components/User/EditProfileForm';
import Cookies from 'js-cookie';
import Profile from './components/User/Profile';
import StoreDashboard from './components/Store/StoreDashboard';
import AddWorkerForm from './components/Worker/AddWorkerForm';
import WorkerDashboard from './components/Worker/WorkerDashboard';
import WorkerDisplay from './components/Worker/WorkerDisplay';
import WorkerEditForm from './components/Worker/WorkerEditForm';

function App() {
  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("user");
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
            <Route exact path="/search" component={SearchDisplay} />

            <Route exact path="/login" component={redirectWithAuth(LoginForm)} />
            <Route exact path="/logout" component={handleLogout}/>
            <Route exact path="/signup" component={SignupForm} />
            <Route path="/users/edit/:id" component={redirectWithoutAuth(EditProfileForm)}/>
            <Route path="/users/:id" component={redirectWithoutAuth(Profile)}/>

            <Route exact path="/storeCalendar" component={redirectWithoutAuth(Calendar)} />
            <Route path="/book/:id" component={ReservationPage} />
            <Route exact path="/store/signup" component={redirectWithoutAuth(StoreSignupForm)} />
            <Route path="/stores/edit/:id" component={redirectWithoutAuth(StoreEditForm)}/>
            <Route path="/stores/addWorker/:id" component={redirectWithoutAuth(AddWorkerForm)}/>
            <Route path="/stores/:id/workers/:id/edit" component={redirectWithoutAuth(WorkerEditForm)}/>
            <Route path="/stores/:id/workers/:id" component={redirectWithoutAuth(WorkerDisplay)}/>
            <Route path="/stores/:id/workers" component={redirectWithoutAuth(WorkerDashboard)}/>
            <Route path="/stores/:id" component={StoreDisplay}/>
            <Route path="/storeDashboard" component={redirectWithoutAuth(StoreDashboard)}/>
            
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
