import React from 'react';
import BookingItem from './bookingItem';
import './bookingList.css';

export default function bookingList(props) {
    const bookings = props.bookings;

    return (
        <ul className='booking-list'>
            {bookings.map(booking => <BookingItem eventId={booking.event._id} 
                                                    title = {booking.event.title}
                                                    price = {booking.event.price}
                                                    desc = {booking.event.desc}
                                                    date = {booking.event.date}
                                                    bookingId = {booking._id}
                                                    viewDetails = {props.viewDetails} />) }
            
        </ul>
    )
}
