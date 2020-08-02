const mongoose = require('mongoose');
const { SchemaMetaFieldDef } = require('graphql');
const Schema = mongoose.Schema
const bookingSchema = new Schema({
    event : {
        type : Schema.Types.ObjectId,
        ref  :'Event'
    },
    user : {
        type : Schema.Types.ObjectId,
        ref  : 'User'
    }
},{
    timestamps : true
});


module.exports = mongoose.model('Bookings', bookingSchema);