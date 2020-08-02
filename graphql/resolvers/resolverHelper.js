const {dateToString} = require('../../helpers/date')
const Event = require('../../models/event');
const User = require('../../models/users');

const transformEvent = event => {
    return {...event._doc,
        creator: user.bind(this,event.creator),
        date: dateToString(event._doc.date)
    }
}
const transformBooking = booking =>{
    return {...booking._doc,
        event : singleEvent.bind(this,booking.event),
        user : user.bind(this,booking._doc.user),
        createdAt : dateToString(booking._doc.createdAt),
        updatedAt : dateToString(booking._doc.updatedAt)
    };
}

const events = eventIds => {
    return Event.find({ _id : { $in: eventIds }})
      .then((evts) => {
        return evts.map((evt) => {
          return transformEvent(evt);
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
            return transformEvent(evt);
        })
        .catch(err => {throw err;})
        
};

//exports.singleEvent = singleEvent;
//exports.events = events;
//exports.user = user;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;