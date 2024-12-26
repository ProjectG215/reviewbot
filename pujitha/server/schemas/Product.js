const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productRating: {
      type: String,
      required: true,
    },
    productLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


ProductSchema.plugin(AutoIncrement, { inc_field: 'productId' });

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;