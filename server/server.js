const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Chat = require('./Routes/Route');
const { app ,server} = require('./Socket/Socket');

app.use(express.json())
require("dotenv").config()

app.use(cors({
    origin:`${process.env.VITE_CLIENT_URL}`,
    credentials:true,
    methods: ["GET","POST"]
}))

mongoose.connect(process.env.VITE_DATABASE_URL,{
    dbName: 'Chat'
})

app.use('/',Chat)


server.listen(1000, () => {
    console.log('server is running on port 1000')
})
