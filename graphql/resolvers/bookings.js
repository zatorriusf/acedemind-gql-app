const {dateToString} = require('../../helpers/date');
const {transformBooking,singleEvent} = require('./resolverHelper')
const Booking = require('../../models/bookings');



module.exports = {
    bookings: () =>{
        return Booking.find()
            .then(bookings =>{
                return bookings.map(booking =>{
                   return transformBooking(booking); 
                })
            }).catch(err => {
                throw err;
            })
    },
    bookEvent :(args) =>{
        const booking = new Booking({
            user: '5f21d63c5cf3e2c9508468ff',
            event: args.eventId
        });
        return booking.save()
            .then(res => {
                return transformBooking(res);
            })
            .catch(err =>{
                throw err;
            })

    },
    cancelBooking :async args =>{
        try {
            const booking = await Booking.findById(args.bookingId);
            const event = singleEvent(booking._doc.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
  }