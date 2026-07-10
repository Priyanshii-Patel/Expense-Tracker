const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema ({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    amount : {
        type : Number,
        required : true,
    },

    category : {
        type : String,
        required : true,
        enum : ["Food", "Rent", "Travels", "Bills", "Groceries", "Transport", "Shopping", "Entertainment", "medical", "Education", "Others" ]
    },

    description : {
        type : String,
        required : true,
    },

    date : {
         type : Date,
         default : Date.now
    },
}, { timestamps : true})

module.exports = mongoose.model("Expense", expenseSchema);