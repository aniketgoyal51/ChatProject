const express=require('express')
const Chat=express()
const {Signup,Login,GetUserData,GetCurrentUser,SendMessage,GetMessage,GetUserDataById}=require('../Controler/ChatControler')

Chat.post('/signup',Signup)
Chat.post('/login',Login)
Chat.get('/GetUserData/:id',GetUserData)
Chat.get('/GetCurrentUser/:email',GetCurrentUser)
Chat.get('/GetUserDataById/:id',GetUserDataById)

Chat.post('/SendMessage/:recieverid',SendMessage)
Chat.get('/:recieverid',GetMessage)


module.exports=Chat