//importing dependencies
const bcrypt = require("bcryptjs");
const User = require("../../models/users");






module.exports = {
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
    }
  }