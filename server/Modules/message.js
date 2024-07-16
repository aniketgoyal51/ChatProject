const mongoose= require('mongoose')

const MessageSchema = new mongoose.Schema(
    {
        senderid:
        {
            type: String,
            ref: "User",
            required: true
        },
        recieverid:
        {
            type: String,
            ref: "User",
            required: true
        },
        message:
        {
            type: String,
            required: true
        }
    },
    {
        //createdAt,updatedAt
        timestamps: true
    }
)

const Message = mongoose.model("messages", MessageSchema)

module.exports=Message