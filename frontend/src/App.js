import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import Auth from './pages/Auth';
import Bookings from './pages/Booking';
import Events from './pages/Events';
import Nav from './cmpnt/nav/nav';
import './app.css';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className='main-content'>
        <Switch>
          <Redirect from="/" to='/auth' exact />
          <Route path="/auth" component={Auth} />
          <Route path="/events" component={Events} />
          <Route path="/bookings" component={Bookings} />
        </Switch>
      </main>
      
    </BrowserRouter>
  );
}

export default App;
