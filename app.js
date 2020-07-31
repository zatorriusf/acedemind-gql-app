const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//importing models
const Event = require("./models/event");
const User = require("./models/users");
 
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send("Hello World!");
  next();
});

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

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds }})
    .then((evts) => {
      evts.map((evt) => {
        return { ...evt._doc, creator: 'balls' };
      });
    })
    .catch((err) => {
      throw err;
    });
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!,
            title: String!,
            desc: String!,
            price: Float!,
            date : String!,
            creator: User!
        }

        input inputEvent {
            title: String!,
            desc: String!,
            price: Float!
        }

        type User {
            _id: ID!,
            email: String!,
            password: String,
            createdEvents: [Event!]
        }

        input inputUser{
            email: String!,
            password: String!
        }

        type RootQuery{
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput : inputEvent!): Event
            createUser(userInput : inputUser!) : User
        }
        schema{
            query : RootQuery
            mutation : RootMutation 
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((e) => {
            return e.map((obj) => {
              return {
                ...obj._doc,
                creator: user.bind(this, obj._doc.creator),
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
            createdEvent = { ...res._doc };
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
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@academine-graphql-tut.gutxf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
