//importing dependencies
const userResolver = require('./users');
const eventsResolver = require('./events');
const bookingsResolver = require('./bookings');

const rootResolver = {
    ...userResolver,
    ...eventsResolver,
    ...bookingsResolver
}

module.exports = rootResolver