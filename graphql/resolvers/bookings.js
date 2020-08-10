const {dateToString} = require('../../helpers/date');
const {transformBooking,singleEvent} = require('./resolverHelper')
const Booking = require('../../models/bookings');



module.exports = {
    bookings: (req) =>{
        if(!req.isAuth){
            throw new Error('User unauthenticated!')
          }
        return Booking.find()
            .then(bookings =>{
                return bookings.map(booking =>{
                   return transformBooking(booking); 
                })
            }).catch(err => {
                throw err;
            })
    },
    bookingsbyUser: (args,req)  =>{
        if(!req.isAuth){
            throw new Error('User unauthenticated!')
          }
          return Booking.find({user : args.userId}).then(bookings =>{
            return bookings.map(booking =>{
               return transformBooking(booking); 
            })
        }).catch(err => {
            throw err;
        })
    },
    bookEvent :(args,req) =>{
        if(!req.isAuth){
            throw new Error('User unauthenticated!')
          }
        const booking = new Booking({
            user: req.userId,
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
    cancelBooking :async (args,req) =>{
        if(!req.isAuth){
            throw new Error('User unauthenticated!')
          }
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