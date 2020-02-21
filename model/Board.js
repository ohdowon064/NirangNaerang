const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema(
    {
        title : {
            type : String,
            required : true
        },
        location : {
            type : String,
            required : true
        },
        period : {
            type : String,
            required : true
        },
        cost : {
            type : Number,
            required : true
        },
        roomType : {
            type : String,
            required : true
        },
        phoneNumber : {
            type : String,
            required : true
        },
        // image : imageSchema
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('Board', boardSchema);