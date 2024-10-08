const {Server} = require("socket.io")
const http = require("http")
const express = require("express")

const app=express()
const server=http.createServer(app)

const io= new Server(server,{
    cors:{
        origin:"https://chat-project-mauve.vercel.app",
        methods:["GET","POST"],
        credentials:true
    }
})

const getRecieversSocketid=(recieverid)=>{
    return usersocketmap[recieverid]
}

const usersocketmap={};//{userid:socket.id}

io.on("connection",(socket)=>{

    const userid=socket.handshake.query.userid
    if(userid!="undefine") usersocketmap[userid]=socket.id

    io.emit("getonlineusers",Object.keys(usersocketmap))

    // console.log("user connected",socket.id)

    //socket.on is used to listen a event and can be used in client and serve both
    socket.on("disconnect",()=>{
        // console.log("user disconnected",socket.id)
        // console.log(usersocketmap)
        delete usersocketmap[userid];
        io.emit("getonlineusers", Object.keys(usersocketmap));
    })
})


module.exports = {app , io , server , getRecieversSocketid}
