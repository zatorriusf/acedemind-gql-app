import React from 'react';
import {NavLink} from 'react-router-dom';
import './nav.css';

export default function nav() {
    return (
        <header className='main-nav'>
            <div className='main-nav__logo'>
                <NavLink to='/auth'>
                    <h1>Bookings right now</h1>
                </NavLink>
            </div>
            <nav className='main-nav__items'>
                <ul>
                    <li><NavLink to='/Events'>Events</NavLink></li>
                    <li><NavLink to='/Bookings'>Bookings</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}
