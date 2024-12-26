
const mongoose = require('mongoose');

const userProductSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    viewedProducts:{
        type:Array,
        required:true
    }
})

const userProductModel = mongoose.model('userProduct',userProductSchema);

module.exports = userProductModel;
