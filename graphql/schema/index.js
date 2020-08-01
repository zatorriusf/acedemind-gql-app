const { buildSchema } = require("graphql");

module.exports = buildSchema(`

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
`)