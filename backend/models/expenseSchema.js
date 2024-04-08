const mongoose = require('mongoose')

const expense = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    paymentMode:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
    }
},{
    timestamps:true
});

const Expense = mongoose.model('expense',expense);
module.exports = Expense;