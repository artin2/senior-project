import React from 'react';
import './App.css';
import ResponsiveNavbar from './components/ResponsiveNavbar/ResponsiveNavbar';
import Homepage from './components/Home/Homepage';


function App() {
  return (
    <div className="App">
      <ResponsiveNavbar/>
      <div className="App-body">
        <Homepage/>
      </div>
    </div>
  );
}

export default App;
