const categories = require("../model/CategoryModel");
const products = require("../model/ProductsModel");

module.exports = async (req, res) => {
  try {
    const categoryList = await categories.find();
    let recProducts = await products.find({
      is_rec: true,
    });
    let bestProducts = await products.find({
      is_best: true,
    });

    res.status(200).json({
      ok: true,
      categories: categoryList,
      recProducts: recProducts,
      bestProducts: bestProducts,
    });
  } catch (e) {
    res.status(404).json({
      ok: false,
      message: e + "",
    });
  }
};
