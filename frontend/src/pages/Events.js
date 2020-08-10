import React , {useState, useRef, useContext, useLayoutEffect}from 'react';
import Modal from '../cmpnt/modal/Modal'
import Backdrop from '../cmpnt/backdrop/Backdrop'
import EventList from '../cmpnt/events/EventList'
import Spinner from '../cmpnt/spinner/Spinner'
import AuthContext from '../context/auth-context';

import './Events.css'

export default function Events() {

    const [modalState, setModalState] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [existingEvents, setExistingEvents] = useState([]);
    const [eventDetail, setEventDetail] = useState();

    const titleEl = useRef();
    const priceEl = useRef();
    const dateEl  = useRef();
    const descEl  = useRef();
    const context = useContext(AuthContext);

    const startEventModal = () => {
        setModalState(!modalState);
    }
    const modalCancel = () => {
        setModalState(false);
        setEventDetail(null);
    }
    const modalConfirm = () =>{
        const title = titleEl.current.value.trim();
        const desc  = descEl.current.value.trim();
        const price = +priceEl.current.value;
        const date = dateEl.current.value || '';

        if(title.length === 0 
            || desc.length === 0
            || price.length === 0
            || date.lenght === 0){
              return;  
            }
      
        const requestBody = {
            query : `
            mutation {
                createEvent(eventInput:{
                  title: "${title}",
                  desc: "${desc}",
                  price: ${price},
                  date: "${new Date(date).toISOString()}"
                }){
                    _id
                    title
                    price
                    desc
                    date
                    creator{
                        _id
                        email
                    }
                }
              }
            `
        }

        fetch('http://localhost:4000/graphql',{
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${context.state.token}`
                }
            }).then(
                res => {
                    if(res.status !== 200 && res.status !==201){
                        console.log(res);
                    }
                    return res.json();
                }
            ).then(data => {
                const newEvent = {
                    _id : data.data.createEvent._id,
                    title : data.data.createEvent.title,
                    price : data.data.createEvent.price,
                    desc : data.data.createEvent.desc,
                    date : data.data.createEvent.date,
                    creator : {
                        _id : context.state.userId
                    }
                };
                console.log(newEvent)
                const updatedEvents =[...existingEvents];
                updatedEvents.push(newEvent);
                setExistingEvents(updatedEvents);

            })
             .catch(err => {throw err;})

        setModalState(!modalState);
    }

    const fetchEvents = () =>{
        setLoadingEvents(true);
        const requestBody = {
            query : `
            query {
                events{
                    _id
                    title
                    price
                    desc
                    date
                    creator{
                        _id
                        email
                    }
                }
              }
            `
        }

        fetch('http://localhost:4000/graphql',{
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${context.state.token}`
                }
            }).then(
                res => {
                    if(res.status !== 200 && res.status !==201){
                        console.log(res);
                    }
                    return res.json();
                }
            ).then(data => {
                const events = data.data.events;
                setExistingEvents(events);
                setLoadingEvents(false);
            })
             .catch(err => {
                setLoadingEvents(false);
                 throw err;
                })
             
    }

    const viewDetails = (id) => {
        const selectedEvent = existingEvents.find(event => event._id === id);
        setEventDetail(selectedEvent);

    }
    useLayoutEffect(fetchEvents,[]);
    return (
        <>
        {context.state.token && <div>
            <h2>Events</h2>
            <button className="btn" onClick={startEventModal}> Add Event</button>
        </div>}
        {modalState && <Backdrop />}
        {modalState && <Modal title="Add Event" 
                                canCancel 
                                cancelText = 'Cancel'
                                modalCancel = {modalCancel} 
                                canConfirm 
                                confirmText = 'Create Event'
                                modalConfirm = {modalConfirm}>
                <form>
                    <div className='form-control'>
                        <label htmlFor='title'>Title</label>
                        <input ref = {titleEl} type='text' id='title'></input>
                    </div>
                    <div className='form-control'>
                        <label htmlFor='price'>Price</label>
                        <input ref = {priceEl} type='number' id='price'></input>
                    </div>
                    <div className='form-control'>
                        <label htmlFor='date'>Date</label>
                        <input ref = {dateEl} type='datetime-local' id='date'></input>
                    </div>
                    <div className='form-control'>
                        <label htmlFor='desc'>Description</label>
                        <textarea ref = {descEl} id='desc' rows="4"></textarea>
                    </div>
                </form>
            </Modal>}
            {eventDetail && <>
                <Backdrop />
                <Modal title={eventDetail.title}
                        canCancel 
                        cancelText = 'Return to Event List'
                        modalCancel = {modalCancel}>
                    <h2>${eventDetail.price.toFixed(2)}</h2>
                    <h3>{new Date(eventDetail.date).toLocaleDateString()}</h3>
                    <p>{eventDetail.desc}</p>

                </Modal>
            </>}
            {loadingEvents && <Spinner />}
            {!loadingEvents &&<EventList events={existingEvents} authUser ={context.state.userId} viewDetails={viewDetails}/> }
           
        </>
    )
}
