import React, {useState,useContext,useLayoutEffect} from 'react';
import EventList from '../cmpnt/events/EventList';
import Backdrop from '../cmpnt/backdrop/Backdrop';
import Modal from '../cmpnt/modal/Modal';
import AuthContext from '../context/auth-context';

export default function Booking() {
    const [currentBookings, setCurrentBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [bookingDetail, setBookingDetail] = useState();
    const context = useContext(AuthContext);

    const fetchBookings = () =>{
        setLoadingBookings(true)
        const requestBody = {
            query : `
                query{
                    bookingsbyUser(userId:"${context.state.userId}"){
                        _id
                        event{
                          title
                        }
                      }
                }
                
            `
        }
        console.log(context.state.token)
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
                        if(res.status === 500){
                            console.log('getting a 500 error which is dumb');
                            console.log('current token : ',context.state.token);
                            console.log('current logged user : ', context.state.userId)

                        } else{
                        console.log(res);
                        }                        
                    }
                    return res.json();
                }
            ).then(data => {
                console.log(data);
                const bookings = data.data.bookingsbyUser;
                setCurrentBookings(bookings);
                setLoadingBookings(false);
            })
             .catch(err => {
                setLoadingBookings(false);
                 throw err;
                })
    }

    useLayoutEffect(fetchBookings,[]);
    return (
        <div>
            <h1>Bookings</h1>
    {currentBookings.length === 0  ? <p>No Bookings</p> : <><p>Bookings detected</p><ul>{currentBookings.map(booking => <li key={booking._id}>{booking.event.title}</li>)}</ul></>}
        </div>
    )
}
