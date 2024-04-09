const User = require("../models/userSchema.js")
const Expense = require("../models/expenseSchema.js")
const addUser = async(req,res)=>{
    try{
        let {email} = req.body
        //console.log(email)
        const user = await User.find({email})
        //console.log(user)
        if(user.length){
            res.status(200).json({success:false,msg:'Email already registered'})
        }else{
            await User.create(req.body)
            res.status(200).json({success:true,msg:'Register successfully'})
        }
    }catch(error){
        //console.log(error);
        res.status(500).json({success:false,msg:'Add User Error'})
    }
}
const loginUser = async(req,res)=>{
    try{
        const user = await User.find(req.body)
        if(!user.length){
            res.status(200).json({success:false,msg:'Invalid credentials or not registered'})
        }else{
            res.status(200).json({success:true,msg:'Login successfully',user})         
        }
    }catch(error){
        res.status(500).json({success:false,msg:'Login User Error'})
    }
}

const deleteUser = async(req,res)=>{
    try{
        let {email} = req.params
        let user = await User.findOneAndDelete({email});
        let deleteapi = await Expense.deleteMany({email});
        if(!user){
            res.status(200).json({success:false,msg:'User not found'})
        }else{
            res.status(200).json({success:true,msg:'User Deleted succesfully'})
        }
    }catch(error){
        res.status(500).json({success:false,msg:'Deleting User Error'})
    }
}
module.exports = {
    addUser,
    loginUser,
    deleteUser,
}