import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import './nav.css';
import AuthContext from '../../context/auth-context';

export default function Nav(props) {

    const context = useContext(AuthContext);
    console.log(context)
    return (
        <header className='main-nav'>
                    <div className='main-nav__logo'>
                        <h1>Bookings right now</h1>
                    </div>
                    <nav className='main-nav__items'>
                        <ul>
                           {!context.state.token && <li><NavLink to='/Auth'>Auth</NavLink></li>}
                            <li><NavLink to='/Events'>Events</NavLink></li>
                            {context.state.token &&(
                                <>
                                    <li><NavLink to='/Bookings'>Bookings</NavLink></li>
                                    <button onClick={()=>{context.dispatch({type: "LOGOUT"})}}>Logout</button>
                                </>)}
                        </ul>
                    </nav>
                </header>        
    )
}
