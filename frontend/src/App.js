import React , {useReducer} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import Auth from './pages/Auth';
import Bookings from './pages/Booking';
import Events from './pages/Events';
import Nav from './cmpnt/nav/nav';
import './app.css';
import AuthContext from './context/auth-context';

const initState = {
  token: null,
  userId: null
};
const reducer = (state, action) =>{
  switch(action.type){
    case "LOGIN":

      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId
      };
      break;
    case "LOGOUT":
      return {
        ...state,
        token: null,
        userId: null
      };
      break;
    default:
      return {...state}
  }
}

function App(props) {
  const [loginState, dispatch] = useReducer(reducer, initState);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{
        state: loginState,
        dispatch: dispatch
        }}>
      <Nav />
      <main className='main-content'>
        <Switch>
        {!loginState.token && <Redirect from="/" to='/auth' exact />}
        {!loginState.token && <Redirect from="/bookings" to='/auth' exact />}
        {!loginState.token && <Route path="/auth" component={Auth} />}
        {loginState.token && <Redirect from="/" to='/events' exact />}
        {loginState.token && <Redirect from="/auth" to='/events' exact />}
        <Route path="/events" component={Events} />
        {loginState.token && <Route path="/bookings" component={Bookings} />}
        </Switch>
      </main>
      </AuthContext.Provider>      
    </BrowserRouter>
  );
}

export default App;
