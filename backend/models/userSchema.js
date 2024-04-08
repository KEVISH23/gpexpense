const mongoose = require('mongoose')

const userDetails = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter email'],
    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        unique:true
    },
    password:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

const User = mongoose.model('user',userDetails)
module.exports = User;