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
const path = require("path");
const comment_images = require("../model/CommentImagesModel");
const comment_dislikes = require("../model/CommentLikeModel");
const comment_likes = require("../model/CommentLikeModel");
const order = require("../model/OrderModel");
const order_items = require("../model/OrderItemModel");
const OrderValidation = require("../validations/OrderValidation");

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

      let productImages = await product_images.find({
        product_id: product.product_id,
      });

      let comments = await comment.find({
        product_id: product.product_id,
      });

      for (let c of comments) {
        let likes = await comment_likes.find({
          comment_id: c.comment_id,
        });
        let dislikes = await comment_dislikes.find({
          comment_id: c.comment_id,
        });
        if (likes.length > 0) {
          c._doc.likes = likes.length;
        }
        if (dislikes.length > 0) {
          c._doc.dislikes = dislikes.length;
        }
      }

      let token = req.cookies.token || req.headers["authorization"];

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
        productImages,
        productOption,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e.toString(),
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

      if (!product) throw new Error("Product not found");

      let comments = await comment.create({
        comment_id: v4(),
        text,
        star,
        user_id: req.user.user_id,
        product_id,
      });

      if (!req.files || !req.files.image) {
        throw new Error("Image is required");
      }

      let image = req?.files?.image;
      let imageType = image.mimetype.split("/")[0];

      if (imageType !== "image" && imageType !== "vector") {
        throw new Error("Image type must be vector or image");
      }

      let imageName = image.md5;
      let imageFormat = image.mimetype.split("/")[1];
      let imagePath = path.join(
        __dirname,
        "..",
        "public",
        "comment_images",
        `${imageName}.${imageFormat}`
      );

      await image.mv(imagePath);

      let comment_image = await comment_images.create({
        comment_id: comments._doc.comment_id,
        image: imageName,
        comment_image_id: v4(),
      });

      let commentImages = await comment_images.find({
        comment_id: comments?._doc?.comment_id,
      });

      res.status(201).json({
        ok: true,
        message: "CREATED",
        comments,
        commentImages,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CommentLikePOST(req, res) {
    try {
      const { category_id } = req.params;
      let comments = await comment.findOne({
        category_id,
      });

      if (!comment) throw new Error("Comment not found");

      let like = await comment_likes.findOne({
        comment_id: comments.comment_id,
        user_id: req.user.user_id,
      });

      if (like) {
        await comment_likes.deleteOne({
          user_id: req.user.user_id,
          comment_id: comments.comment_id,
        });
      } else {
        await comment_dislikes.deleteOne({
          comment_id: comments.comment_id,
          user_id: req.user.user_id,
        });

        like = await comment_likes.create({
          user_id: req.user.user_id,
          comment_id: comments.comment_id,
          like_id: v4(),
        });
      }

      res.status(201).json({
        ok: true,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CommentLikeDELETE(req, res) {
    try {
      const { category_id } = req.params;
      let comments = await comment.findOne({
        category_id,
      });

      if (!comment) throw new Error("Comment not found");

      await comment_likes.deleteOne({
        comment_id: comments.comment_id,
        user_id: req.user.user_id,
      });

      res.status(200).json({
        ok: true,
        message: "Deleted like",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CommentDisLikePOST(req, res) {
    try {
      const { category_id } = req.params;
      let comments = await comment.findOne({
        category_id,
      });

      if (!comment) throw new Error("Comment not found");

      let dislike = await comment_dislikes.findOne({
        comment_id: comments.comment_id,
        user_id: req.user.user_id,
      });

      if (dislike) {
        await comment_dislikes.deleteOne({
          user_id: req.user.user_id,
          comment_id: comments.comment_id,
        });
      } else {
        await comment_likes.deleteOne({
          comment_id: comments.comment_id,
          user_id: req.user.user_id,
        });

        dislike = await comment_dislikes.create({
          user_id: req.user.user_id,
          comment_id: comments.comment_id,
          dis_like_id: v4(),
        });
      }

      res.status(201).json({
        ok: true,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CommentDisLikeDELETE(req, res) {
    try {
      const { category_id } = req.params;
      let comments = await comment.findOne({
        category_id,
      });

      if (!comment) throw new Error("Comment not found");

      await comment_dislikes.deleteOne({
        comment_id: comments.comment_id,
        user_id: req.user.user_id,
      });

      res.status(200).json({
        ok: true,
        message: "Deleted dislike",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async OrderPOST(req, res) {
    try {
      const { full_name, shopping_region, shopping_address, phone, comment } =
        await OrderValidation(req.body);

      let cart = await carts.find({
        user_id: req.user.user_id,
      });

      if (!cart) throw new Error("Cart is empty");

      let orders = await order.create({
        order_id: v4(),
        user_id: req.user.user_id,
        time: new Date(),
        full_name,
        shopping_address,
        shopping_region,
        phone,
        comment,
      });

      for (let c of cart) {
        await order_items.create({
          count: c.count,
          product_id: c.product_id,
          order_id: orders._doc.order_id,
          order_item_id: v4(),
        });
      }

      await carts.deleteMany({
        user_id: req.user.user_id,
      });

      let orderItems = await order_items.find({
        order_id: orders._doc.order_id,
      });

      res.status(201).json({
        ok: true,
        orders,
        orderItems,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async OrderPATCH(req, res) {
    try {
      const { order_id } = req.params;
      const { status } = req.body;

      if (!status) throw new Error("Order not found");

      let orders = await order.findOne({
        order_id,
      });

      if (!orders) throw new Error("Order not found");
      await order.findOneAndUpdate(
        {
          order_id,
        },
        {
          status,
        }
      );

      res.status(200).json({
        ok: true,
        message: "Updated to status " + status,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }
};
