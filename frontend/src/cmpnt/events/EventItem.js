import React from 'react'
import './EventItem.css'
export default function EventItem(props) {
    return (
        <li key ={props.eventId} className='event__list-item'>
            <div><h3>{props.title}</h3>
            <h4>{new Date(props.date).toLocaleDateString()} | $ {props.price.toFixed(2)}</h4></div>
            <div>
                {props.creator === props.authUser ? <p>You are the Owner of this event</p> : <button className='btn' onClick={()=>{
                    props.viewDetails(props.eventId)
                }}>View Details</button>}
            </div>
        </li>
    )
}
