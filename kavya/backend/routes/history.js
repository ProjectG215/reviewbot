const express = require('express');
const cors = require('cors');
const productModel = require('../schemas/productSchemas');
const userProductModel = require('../schemas/historySchemas');
const historyRouter = express.Router();
historyRouter.use(cors());
historyRouter.use(express.json());

historyRouter.get('/history/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userProductModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const viewedProductIds = user.viewedProducts;
    const products = await productModel.find({ productId: { $in: viewedProductIds } });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = historyRouter;
