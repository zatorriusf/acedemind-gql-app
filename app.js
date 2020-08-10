const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const isAuth = require('./middleware/isAuth')
const mongoose = require("mongoose");

const gQLSchema = require('./graphql/schema/index');
const gQLResolvers = require('./graphql/resolvers/index');
 
const app = express();

//app.use(bodyParser.json());
app.use((req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method ==='OPTIONS'){
    return res.sendStatus(200);
  }
  next();
})

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: gQLSchema,
    rootValue: gQLResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@academine-graphql-tut.gutxf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => console.log(err));
