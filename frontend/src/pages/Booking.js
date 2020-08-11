import React, {useState,useContext,useLayoutEffect} from 'react';
import BookingList from '../cmpnt/bookings/bookingList'
import Backdrop from '../cmpnt/backdrop/Backdrop';
import Spinner from '../cmpnt/spinner/Spinner'
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
                          _id
                          title
                          price
                          date
                          desc
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
                const bookings = data.data.bookingsbyUser;
                setCurrentBookings(bookings);
                setLoadingBookings(false);
            })
             .catch(err => {
                setLoadingBookings(false);
                 throw err;
                })
    }
    const viewDetails = (id) =>{
        const selectedBooking = currentBookings.find(booking => booking._id === id);
        console.log(selectedBooking)
        setBookingDetail(selectedBooking);
    }
    const modalCancel = () => {
        setBookingDetail(null);
    }
    const modalCancelBooking = () =>{
        const requestBody = {
            query : `
                mutation{
                    cancelBooking(bookingId:"${bookingDetail._id}"){
                        _id
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
                fetchBookings();
                setBookingDetail(null);
            })
             .catch(err => {
                 throw err;
                })
    }

    useLayoutEffect(fetchBookings,[]);
    return (
        <div>
            <h1>Bookings</h1>
            {loadingBookings && <Spinner />}
            {!loadingBookings && <BookingList bookings = {currentBookings} viewDetails={viewDetails} />}
            {bookingDetail && <>
                <Backdrop />
                <Modal title={bookingDetail.event.title}
                        canCancel 
                        cancelText = 'Return to Bookings List'
                        modalCancel = {modalCancel}
                        canConfirm
                        confirmText = 'Cancel Booking'
                        modalConfirm = {modalCancelBooking}>
                    <h2>${bookingDetail.event.price.toFixed(2)}</h2>
                    <h3>{new Date(bookingDetail.event.date).toLocaleDateString()}</h3>
                    <p>{bookingDetail.event.desc}</p>
                </Modal>
            </>}
    {currentBookings.length === 0  ? <p>No Bookings</p> : <><p>Bookings detected</p><ul>{currentBookings.map(booking => <li key={booking._id}>{booking.event.title}</li>)}</ul></>}
        </div>
    )
}
