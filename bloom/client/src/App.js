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

function App() {
  // general note: anyplace where we can pass information and avoid an extra call to get that information, we should
  // example of how to pass information: 
  // Say we want to call stores/1/workers/1
  // this says lets get worker 1 from store 1, so we need the workers info
  // odds are we are calling this from the store dashboard where we have the worker entry, so we can pass
  // it to the worker display component by calling the following function on click 

  // triggerWorkerDisplay(id) {
  //   this.props.history.push({
  //     pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + id
  //     state: this.state.worker
  //   })
  // }

  // and access it by doing
  // this.props.location.state.worker

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href='/'
  }

  // let user = null;
  // if(Cookies.get('token') != null) {  //should be user?
  //   user = JSON.parse(Cookies.get('user').substring(2))
  // }

  return (
    <div className="App">
      <Router>
        <MainNavbar user={Cookies.get('token') ? JSON.parse(Cookies.get('user').substring(2)) : null}/>
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


// class App extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       message: {}
//     };
//     this.addAlert = this.addAlert.bind(this)
//   }
  
//   addAlert(messagePassed) {
//     this.setState({
//       message: messagePassed
//     })
//   }

//   render() {
//     // general note: anyplace where we can pass information and avoid an extra call to get that information, we should
//     // example of how to pass information: 
//     // Say we want to call stores/1/workers/1
//     // this says lets get worker 1 from store 1, so we need the workers info
//     // odds are we are calling this from the store dashboard where we have the worker entry, so we can pass
//     // it to the worker display component by calling the following function on click 

//     // triggerWorkerDisplay(id) {
//     //   this.props.history.push({
//     //     pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + id
//     //     state: this.state.worker
//     //   })
//     // }

//     // and access it by doing
//     // this.props.location.state.worker

//     function handleLogout() {
//       Cookies.remove("token");
//       Cookies.remove("user");
//       window.location.href='/'
//     }

//     return (
//       <div className="App">
//         <Router>
//           <MainNavbar/>
//           <Alert messagePassed={this.state.message}/>
//           <div className="App-body">
//             <Switch>
//               <Route exact path="/" component={Homepage} />
//               <Route exact path="/help" component={StaticPage} />
//               <Route exact path="/about" component={StaticPage} />
//               <Route exact path="/search" component={SearchDisplay} />

//               <Route exact path="/login" component={redirectWithAuth(LoginForm, this.addAlert)} />
//               <Route exact path="/logout" component={handleLogout}/>
//               <Route exact path="/signup" component={SignupForm} />
//               <Route path="/users/edit/:user_id" component={redirectWithoutAuth(EditProfileForm)}/>
//               <Route path="/users/:user_id/stores" component={redirectWithoutAuth(UserStoresDashboard)}/>
//               <Route path="/users/:user_id" component={redirectWithoutAuth(Profile)}/>

//               <Route exact path="/storeCalendar" component={redirectWithoutAuth(Calendar)} />
//               <Route path="/book/:store_id" component={ReservationPage} />
//               <Route exact path="/store/signup" component={redirectWithoutAuth(StoreSignupForm)} />
//               <Route path="/stores/edit/:store_id" component={redirectWithoutAuth(StoreEditForm)}/>
            
//               <Route path="/stores/addService/:store_id" component={redirectWithoutAuth(AddServiceForm)}/>
//               <Route path="/stores/:store_id/services/:service_id/edit" component={redirectWithoutAuth(ServiceEditForm)}/>
//               <Route path="/stores/:store_id/services/:service_id" component={redirectWithoutAuth(ServiceDisplay)}/>
//               <Route path="/stores/:store_id/services" component={redirectWithoutAuth(ServiceDashboard)}/>

//               <Route path="/stores/addWorker/:store_id" component={redirectWithoutAuth(AddWorkerForm)}/>
//               <Route path="/stores/:store_id/workers/:worker_id/edit" component={redirectWithoutAuth(WorkerEditForm)}/>
//               <Route path="/stores/:store_id/workers/:worker_id" component={redirectWithoutAuth(WorkerDisplay)}/>
//               <Route path="/stores/:store_id/workers" component={redirectWithoutAuth(WorkerDashboard)}/>
//               <Route path="/stores/:store_id" component={StoreDisplay}/>
              
//             </Switch>
//           </div>
//         </Router>
//       </div>
//     );
//   }
// }