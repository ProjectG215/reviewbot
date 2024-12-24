const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    conversation:{
        type:Map,
        of:String,
        required: true,
    }
},{timestamps:true});



const ChatModel = mongoose.model("chats",ChatSchema)



const ChatHistorySchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'users'
    },
     
    chat : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'chats'  
    }]
},{timestamps:true});

const ChatHistoryModel = mongoose.model("chatHistory",ChatHistorySchema)


module.exports = {
    ChatModel,
    ChatHistoryModel,
};