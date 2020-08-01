const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const gQLSchema = require('./graphql/schema/index');
const gQLResolvers = require('./graphql/resolvers/index');
 
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send("Hello World!");
  next();
});




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
    app.listen(3000);
  })
  .catch((err) => console.log(err));
