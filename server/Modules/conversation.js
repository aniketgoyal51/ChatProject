const mongoose= require('mongoose')

const ConversationSchema = new mongoose.Schema({
    participants: [
        {
            type: String,
            ref: 'User'
            
        }
    ],
    messages: [
        {
            type: String,
            ref: 'messages',
            default: []
        }
    ]
},
{
    //createdAt,updatedAt
    timestamps: true
}
)

const Conversation = mongoose.model('conversations', ConversationSchema)

module.exports=Conversation