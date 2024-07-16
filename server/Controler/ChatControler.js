const User = require('../Modules/register.js');
const Conversation = require('../Modules/conversation.js');
const Message=require('../Modules/message.js');
const { getRecieversSocketid, io } = require('../Socket/Socket.js');

// Signup
const Signup = async (req, res) => {
    // console.log(req.body.email);
    try {
        const exist = await User.findOne({ email: req.body.email });
        if (exist) {
            res.send("User already exists");
        } else {
            await User.create(req.body);
            res.send("User created");
        }
    } catch (error) {
        console.error("SignupError:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Login
const Login = async (req, res) => {
    try {
        const {email,password}  = req.body
        const exist = await User.findOne({ email });
        if (exist) {
            if (password === exist.password) {
                res.send("login Successful");
            }
        } else {
            res.status(401).send("login Failed, User doest exist");
        }
    }
    catch (error) {
        console.error("LoginError:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Get users data
const GetUserData = async (req, res) => {
    // console.log(req.params.id)
    try {
        const data= await User.find({_id:{$ne:req.params.id}}).select("-password")
        res.send(data)
    } catch (error) {
        console.error("GetuserdataError:", error);
    }
}

//get Current user data by id
const GetUserDataById = async (req, res) => {
    const id=req.params.id
    // console.log("id",id)
    try {
        const data = await User.findOne({ _id: id })
        res.send(data)
    }
    catch (error) {
        console.error("getuserdatabyidError:", error);
    }
}

//get Current user data
const GetCurrentUser = async (req, res) => {
    const email=req.params.email
    // console.log(email)
    try {
        const data = await User.findOne({ email: email })
        res.send(data)
    }
    catch (error) {
        console.error("getcurrentuserError:", error);
    }
}

//Send Message
const SendMessage = async (req, res) => {
    const recieverid = req.params.recieverid

    const { senderid, msg:message } = req.body
    // console.log(senderid, recieverid, message)

    try {
        let conversation=await Conversation.findOne({
            participants: {
                $all: [senderid, recieverid]
            }
        })
        if(!conversation){
            conversation=await Conversation.create({participants: [senderid, recieverid]})
        }

        const newMessage = new Message({
            senderid,
            recieverid,
            message
        })
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
        
        //save parallely
        await Promise.all([
            newMessage.save(),
            conversation.save()
        ])

        // socket io for message
        const recieversocketid=getRecieversSocketid(recieverid)
        if(recieversocketid){
            // use to send event to specific user
            // console.log("recieversocketid",recieversocketid)
            io.to(recieversocketid).emit("newMessage",newMessage)

        }

        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error:", error);
        res.send(500).json({error:"Internal Server Error"});
    }
}

// get messages
const GetMessage = async (req, res) => {
    try {
        const recieverid=req.params.recieverid
        const senderid=req.query.senderid

        const conversation=await Conversation.findOne({
            participants: {
                $all: [senderid, recieverid]
            }
        }).populate("messages"); //not reference but actual messages

        if(!conversation || !conversation.messages){
            return res.status(404).json({error:"Start a conversation"});
        }
        const messages=conversation.messages || []
        
        res.status(200).json(messages)
    }

    catch (error) {
        console.error("Error:", error);
        res.send(500).json({error:"Internal Server Error"});
    }
}

module.exports = { Signup, Login ,GetUserData,GetCurrentUser,SendMessage,GetMessage,GetUserDataById};