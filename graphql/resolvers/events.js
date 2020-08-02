const {dateToString} = require('../../helpers/date');
const {transformEvent} = require('./resolverHelper')
const Event = require("../../models/event");
const User = require('../../models/users')



module.exports = {
    events: () => {
      return Event.find()
        .then((e) => {
          return e.map((evt) => {
            return transformEvent(evt);
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
          createdEvent =  transformEvent(res);
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
    }
  }