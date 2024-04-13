const express = require('express')
const {addUser,loginUser,deleteUser,allUsers} = require('../../controller/signin.controller.js')
const route = express.Router()

route.post('/addUser' , addUser)
route.post('/loginUser',loginUser)
route.delete('/deleteUser/:email',deleteUser)
route.get('/allUsers',allUsers)
module.exports = route