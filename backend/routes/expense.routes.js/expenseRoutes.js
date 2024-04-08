const express = require('express')
const { addExpense,getExpenseByEmail,updateById,deleteById} = require('../../controller/expense.controller')
const route = express.Router()

route.post('/addExpense',addExpense)
route.get('/getExpenseByEmail/:email',getExpenseByEmail)
route.put('/updateById/:id',updateById)
route.delete('/deleteById/:id',deleteById)

module.exports = route