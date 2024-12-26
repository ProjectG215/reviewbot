const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    password:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
