const {dateToString} = require('../../helpers/date')
const Event = require('../../models/event');
const User = require('../../models/users');
const DataLoaer = require('dataloader');

const eventLoader = new DataLoaer((eventIds) => {
  return events(eventIds);
});
const userLoader = new DataLoaer((userIds) =>{
  return User.find({_id: {$in: userIds}});
})

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
    return userLoader.load(userId.toString())
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

const singleEvent = async eventId => {
     return eventLoader.load(eventId.toString())
        .then(evt =>{
            return evt;
        })
        .catch(err => {throw err;})
        
};

exports.singleEvent = singleEvent;
//exports.events = events;
//exports.user = user;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;