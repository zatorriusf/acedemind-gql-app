const bcrypt = require("bcryptjs");

//importing models
const Event = require("../../models/event");
const User = require("../../models/users");

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

module.exports = {
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
  }