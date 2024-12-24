const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({

    userId:{
        type:Number,
        // required:true,
        // unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true


    }


})

userSchema.plugin(AutoIncrement, { inc_field: 'UserId' });

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;