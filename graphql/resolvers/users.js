//importing dependencies
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
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
    },
    login: async ({email,password}) =>{
        const user = await User.findOne({email : email});
        if(!user){throw new Error('email address not found');}
        const correctPassword = await bcrypt.compare(password,user.password);
        if(!correctPassword){throw new Error('password is not correct');}
        const token = jwt.sign({userId : user.id, email: user.email},'superdupersecrettime',{expiresIn: '1h'});
        return{
            userId : user.id,
            token : token,
            tokenExpiration : 1
        }
    }
  }