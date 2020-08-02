const bcrypt = require("bcryptjs");

//importing models
const Event = require("../../models/event");
const User = require("../../models/users");
const Booking = require('../../models/bookings');

const events = eventIds => {
    return Event.find({ _id : { $in: eventIds }})
      .then((evts) => {
        return evts.map((evt) => {
          return { ...evt._doc, creator: user.bind(this,evt.creator)};
        });
      })
      .catch((err) => {
        throw err;
      });
  };
  
const user = (userId) => {
    return User.findById(userId)
      .then((user) => {
        return {
          ...user._doc,
          createdEvents: events.bind(this, user.createdEvents)
        };
      })
      .catch((err) => {
        throw err;
      });
  };

const singleEvent = eventId => {
    return Event.findOne(eventId)
        .then(evt =>{
            return {...evt._doc,
                creator: user.bind(this,evt.creator),
                date: new Date(evt._doc.date).toISOString()
            }
        })
        .catch(err => {throw err;})
        
};

module.exports = {
    bookings: () =>{
        return Booking.find()
            .then(bookings =>{
                return bookings.map(booking =>{
                   return {...booking._doc,
                    event : singleEvent.bind(this,booking._doc.event),
                    user : user.bind(this,booking._doc.user),
                    createdAt : new Date(booking._doc.createdAt).toISOString(),
                    updatedAt : new Date(booking._doc.updatedAt).toISOString()
                    }; 
                })
            }).catch(err => {
                throw err;
            })
    },
    events: () => {
      return Event.find()
        .then((e) => {
          return e.map((obj) => {
            return {
              ...obj._doc,
              date: new Date(obj._doc.date).toISOString(),
              creator: user.bind(this, obj._doc.creator)
            };
          });
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    createEvent: (args) => {
      const evt = new Event({
        title: args.eventInput.title,
        desc: args.eventInput.desc,
        price: +args.eventInput.price,
        date: new Date().toISOString(),
        creator: "5f21d63c5cf3e2c9508468ff",
      });

      return evt
        .save()
        .then((res) => {
          createdEvent = { ...res._doc, date: new Date(obj._doc.date).toISOString(), creator: user.bind(this,res._doc.creator) };
          return User.findById("5f21d63c5cf3e2c9508468ff");
        })
        .then((user) => {
          user.createdEvents.push(evt._id);
          user.save();
        })
        .then((res) => {
          console.log(res);
          return createdEvent;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      return evt;
    },
    createUser: (args) => {
      return User.findOne({ email: args.userInput.email })
        .then((user) => {
          if (user) {
            throw new Error("Email address already in use");
          }
          return bcrypt.hash(args.userInput.password, 12);
        })
        .then((hashedPW) => {
          const usr = new User({
            email: args.userInput.email,
            password: hashedPW,
          });
          return usr.save();
        })
        .then((res) => {
          return { ...res._doc, password: null };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    bookEvent :(args) =>{
        const booking = new Booking({
            user: '5f21d63c5cf3e2c9508468ff',
            event: args.eventId
        });
        return booking.save()
            .then(res => {
                return {...res._doc,
                    createdAt : new Date(booking._doc.createdAt).toISOString(),
                    updatedAt : new Date(booking._doc.updatedAt).toISOString()
                }
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