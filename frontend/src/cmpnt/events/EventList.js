
import React from 'react'
import EventItem from './EventItem'
import './EventList.css'



export default function EventList(props) {
    const events = props.events;

    return (
        <ul className='event__list'>
            {events.map(event => <EventItem eventId={event._id} 
                                            title={event.title} 
                                            price={event.price}
                                            date={event.date}
                                            creator={event.creator._id}
                                            authUser={props.authUser}
                                            viewDetails = {props.viewDetails}/>)}
        </ul>
    )
}
