// console.log('running')
//kevishthakkar001
//bB1vrasjs9Kqw0wq
// mongodb+srv://kevishthakkar001:bB1vrasjs9Kqw0wq@cluster0.tzuko1v.mongodb.net/
// mongodb+srv://kevishthakkar001:<password>@cluster0.tzuko1v.mongodb.net/

// ExpenseGrowthpad

const express = require('express')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoutes/user.js')
const cors = require('cors')
//expense route thi bki...
const expenseRoute = require('./routes/expense.routes.js/expenseRoutes.js')
const app = express()
app.use(express.json())
mongoose.connect('mongodb+srv://kevishthakkar001:bB1vrasjs9Kqw0wq@cluster0.tzuko1v.mongodb.net/').then(()=>{
    console.log('connected to db')
    app.listen(1923,()=>{
        console.log('1923 se bol rela hai mein');
    })
})
app.use(cors())
app.use('/api/v1/user',userRoute)
app.use('/api/v1/expense',expenseRoute)
// route.get('/')