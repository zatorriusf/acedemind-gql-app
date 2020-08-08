import React , {useState, useRef, useContext, useLayoutEffect}from 'react';
import Modal from '../cmpnt/modal/Modal'
import Backdrop from '../cmpnt/backdrop/Backdrop'
import AuthContext from '../context/auth-context';
import './Events.css'

export default function Events() {

    const [modalState, setModalState] = useState(false);
    const [existingEvents, setExistingEvents] = useState([{title : 'loading'}]);
    const titleEl = useRef();
    const priceEl = useRef();
    const dateEl  = useRef();
    const descEl  = useRef();
    const context = useContext(AuthContext);

    const startEventModal = () => {
        setModalState(!modalState);
    }
    const modalCancel = () => {
        setModalState(!modalState);
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
                console.log(data);
                fetchEvents();
            })
             .catch(err => {throw err;})

        setModalState(!modalState);
    }

    const fetchEvents = () =>{
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
                console.log(events)
                setExistingEvents(events);
            })
             .catch(err => {throw err;})
             
    }
    useLayoutEffect(fetchEvents,[]);
    return (
        <>
        {context.state.token && <div>
            <h2>Events</h2>
            <button className="btn" onClick={startEventModal}> Add Event</button>
        </div>}
        {modalState && <Backdrop />}
        {modalState && <Modal title="Add Event" canCancel canConfirm modalCancel = {modalCancel} modalConfirm = {modalConfirm}>
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

        <ul className="events__list">
            {existingEvents.map(event => <li key={event._id} className='events__list-item' >{event.title}</li> )}
        </ul>
        </>
    )
}
