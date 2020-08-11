import React from 'react';
import './bookingItem.css';

export default function bookingItem(props) {
    return (
        <li className='booking-list__item'>
            <div><h3>{props.title}</h3>
            <h4>{new Date(props.date).toLocaleDateString()} | $ {props.price.toFixed(2)}</h4></div>
            <div>
                <button className='btn' onClick={()=>{
                    props.viewDetails(props.bookingId);
                }}>View Details</button>
            </div>
        </li>
    )
}
