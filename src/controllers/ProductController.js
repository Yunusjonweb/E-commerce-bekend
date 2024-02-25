const CategoriesModel = require("../model/CategoryModel");
const products = require("../model/ProductsModel");
const ProductsModel = require("../model/ProductsModel");
const carts = require("../model/CartModel");
const { v4 } = require("uuid");
const product_option = require("../model/ProductOptionModel");
const product_images = require("../model/ProductImgeModel");
const comment = require("../model/CommentModel");
const { checkToken } = require("../modules/jwt");
const CommentPostValidation = require("../validations/CommentPostValidation");

module.exports = class ProductsController {
  static async ProductsGET(req, res) {
    try {
      const { category_id } = req.params;

      const [recProducts, bestProducts, categoryList, productsList] =
        await Promise.all([
          ProductsModel.find({ is_rec: true }),
          ProductsModel.find({ is_best: true }),
          CategoriesModel.find(),
          ProductsModel.find({ category_id }),
        ]);

      if (!category_id) {
        throw new Error("Category not found");
      }

      res.status(200).json({
        ok: true,
        productsList,
        recProducts,
        bestProducts,
        categoryList,
      });
    } catch (e) {
      console.log(e.toString());
    }
  }

  static async CartAddPOST(req, res) {
    try {
      const { product_id } = req.params;
      let productsList = await products.findOne({
        product_id,
      });

      if (!productsList) throw new Error("Product not found");

      let cart = await carts.findOne({
        product_id: productsList,
        user_id: req.user.user_id,
      });

      if (cart) throw new Error("Cart is already added");

      await carts.create({
        cart_id: v4(),
        count: 1,
        product_id,
        user_id: req.user.user_id,
      });

      res.status(201).json({
        ok: true,
        message: "Added",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CartPlusPATCH(req, res) {
    try {
      const { product_id } = req.params;
      let product = await ProductsModel.findOne({
        product_id,
      });

      if (!product) throw new Error("Product not found");

      let cart = await carts.findOne({
        product_id,
        user_id: req.user.user_id,
      });

      if (!cart) throw new Error("Cart not found");

      await carts.findOneAndUpdate(
        {
          cart_id: cart.cart_id,
        },
        {
          count: cart.count + 1,
        }
      );

      res.status(200).json({
        ok: true,
        message: "Plus+1",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CartMinusPATCH(req, res) {
    try {
      const { product_id } = req.params;
      let productsList = await products.findOne({
        product_id,
      });

      if (!productsList) throw new Error("Product not found");

      let cart = await carts.findOne({
        product_id,
        user_id: req.user.user_id,
      });

      if (!cart) throw new Error("Cart not found");

      if (cart.count == 1) {
        await carts.deleteOne({
          cart_id: cart.cart_id,
        });
      } else {
        await carts.findOneAndUpdate(
          {
            card_id: cart.cart_id,
          },
          {
            count: cart.count - 1,
          }
        );
      }

      res.status(200).json({
        ok: true,
        message: "Minus-1",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductsSearchGET(req, res) {
    try {
      const { q } = req.query;
      // let productsList = await ProductsModel.aggregate([
      //   {
      //     $match: {
      //       product_name: {
      //         $search: q,
      //       },
      //     },
      //   },
      // ]);

      let productsList = await products.search({
        text: {
          query: q,
          path: "product_name",
        },
      });

      res.status(200).json({
        ok: true,
        productsList,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CartGET(req, res) {
    try {
      let cart = await carts.find({
        user_id: req.user.user_id,
      });
      console.log(cart);
      res.status(200).json({
        ok: true,
        cart,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductGET(req, res) {
    try {
      const { product_slug } = req.params;
      let product = await products.findOne({
        product_slug,
      });

      if (!product) throw new Error("Product not found");

      let productOption = await product_option.findOne({
        product_id: product.product_id,
      });

      console.log(productOption, 88);

      let productIImages = await product_images.find({
        product_id: product.product_id,
      });

      let comments = await comment.findOne({
        product_id: product.product_id,
      });

      let token = req?.cookies?.token || req?.headers["authorization"];

      token = checkToken(token);

      if (token) {
        req.user = token;
      }

      let cart;

      if (req.user) {
        cart = await carts.findOne({
          user_id: req.user.user_id,
          product_id: product.product_id,
        });
      }

      res.status(200).json({
        ok: true,
        product,
        cart,
        comments,
        productIImages,
        productOption,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CommentPOST(req, res) {
    try {
      const { product_id } = req.params;

      const { text, star } = await CommentPostValidation(req.body);

      let product = await ProductsModel.findOne({
        product_id,
      });

      let comments = await comment.create({
        comment_id: v4(),
        text,
        star,
        user_id: req.user.user_id,
        product_id,
      });

      res.status(201).json({
        ok: true,
        message: "CREATED",
        comments,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }
};
