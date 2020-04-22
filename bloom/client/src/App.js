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
import UserStoresDashboard from './components/Store/UserStoresDashboard';
import AddWorkerForm from './components/Worker/AddWorkerForm';
import WorkerDashboard from './components/Worker/WorkerDashboard';
import WorkerDisplay from './components/Worker/WorkerDisplay';
import WorkerEditForm from './components/Worker/WorkerEditForm';
import AddServiceForm from './components/Service/AddServiceForm';
import ServiceDashboard from './components/Service/ServiceDashboard';
import ServiceDisplay from './components/Service/ServiceDisplay';
import ServiceEditForm from './components/Service/ServiceEditForm';
import Alert from './components/Flash/Alert';
import {
  userLogout
} from './reduxFolder/actions/user'
import store from './reduxFolder/store';

function App() {
  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("user"); // don't think we need any cookies anymore now that redux persists to local storage for us...
    store.dispatch(userLogout())
    window.location.href='/'
  }

  return (
    <div className="App">
      <Router>
        <MainNavbar/>
        <Alert/>
        <div className="App-body">
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/help" component={StaticPage} />
            <Route exact path="/about" component={StaticPage} />
            <Route path="/search" component={SearchDisplay} />

            <Route exact path="/login" component={redirectWithAuth(LoginForm)} />
            <Route exact path="/logout" component={handleLogout}/>
            <Route exact path="/signup" component={SignupForm} />
            <Route path="/users/edit/:user_id" component={redirectWithoutAuth(EditProfileForm)}/>
            <Route path="/users/:user_id/stores" component={redirectWithoutAuth(UserStoresDashboard)}/>
            <Route path="/users/:user_id" component={redirectWithoutAuth(Profile)}/>

            <Route exact path="/storeCalendar" component={redirectWithoutAuth(Calendar)} />
            <Route path="/book/:store_id" component={ReservationPage} />
            <Route exact path="/store/signup" component={redirectWithoutAuth(StoreSignupForm)} />
            <Route path="/stores/edit/:store_id" component={redirectWithoutAuth(StoreEditForm)}/>

            <Route path="/stores/addService/:store_id" component={redirectWithoutAuth(AddServiceForm)}/>
            <Route path="/stores/:store_id/services/:service_id/edit" component={redirectWithoutAuth(ServiceEditForm)}/>
            <Route path="/stores/:store_id/services/:service_id" component={redirectWithoutAuth(ServiceDisplay)}/>
            <Route path="/stores/:store_id/services" component={redirectWithoutAuth(ServiceDashboard)}/>

            <Route path="/stores/addWorker/:store_id" component={redirectWithoutAuth(AddWorkerForm)}/>
            <Route path="/stores/:store_id/workers/:worker_id/edit" component={redirectWithoutAuth(WorkerEditForm)}/>
            <Route path="/stores/:store_id/workers/:worker_id" component={redirectWithoutAuth(WorkerDisplay)}/>
            <Route path="/stores/:store_id/workers" component={redirectWithoutAuth(WorkerDashboard)}/>
            <Route path="/stores/:store_id" component={StoreDisplay}/>

          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;