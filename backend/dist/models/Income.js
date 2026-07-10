const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema ({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    amount : {
        type : Number,
        required : true,
    },

    source : {
        type : String,
        required : true,
        trim : true,
    },

    date : {
        type : Date,
        default : Date.now,
    }
}, { timestamps : true});

module.exports = mongoose.model("income",incomeSchema)