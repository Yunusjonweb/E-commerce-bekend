const categories = require("../model/CategoryModel");
const slugify = require("slugify");
const users = require("../model/UserModel");
const CategoryValidation = require("../validations/CategoryValidation");
const { v4 } = require("uuid");
const products = require("../model/ProductsModel");
const ProductValidation = require("../validations/ProductValidation");
const product_images = require("../model/ProductImgeModel");
const path = require("path");
const ProductOptionValidation = require("../validations/ProductOptionValidation");
const product_option = require("../model/ProductOptionModel");
const ProductPATCHValidation = require("../validations/ProductPATCHValidation");

module.exports = class AdminController {
  static async UsersGET(req, res) {
    try {
      let customers = await users.find();
      console.log(customers);
      res.status(200).json({
        ok: true,
        users: customers,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CreateAdminPATCH(req, res) {
    try {
      const { user_id } = req.params;
      let user = await users.findOneAndUpdate(
        {
          user_id,
        },
        {
          role: "admin",
        }
      );

      res.status(200).json({
        ok: true,
        message: "Successfully",
        user,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async UserDELETE(req, res) {
    try {
      let user = await users.findOne({
        user_id: req.params.user_id,
      });

      if (!user) throw new Error("User not found");
      if (user.role === "superadmin") {
        res.status(403).json({
          ok: false,
          message: "Permissions denied",
        });
        return;
      }
      await users.deleteOne({
        user_id: req.params.user_id,
      });

      res.status(200).json({
        ok: true,
        message: "DELETED",
      });
    } catch (e) {
      res.status(404).json({
        ok: true,
        message: e + "",
      });
    }
  }

  static async CategoriesGET(req, res) {
    try {
      let categoryList = await categories.find();
      res.status(200).json({
        ok: true,
        categoryList,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CategoryPOST(req, res) {
    try {
      const { category_name } = await CategoryValidation(req.body);

      let category = await categories.findOne({
        category_name,
      });

      if (category) throw new Error("Category has already been added");

      category = await categories.create({
        category_id: v4(),
        category_name,
      });

      res.status(201).json({
        ok: true,
        message: "Crated category",
        category: category,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CategoryPATCH(req, res) {
    try {
      const { category_name } = await CategoryValidation(req.body);

      let category = await categories.findOne({
        category_id: req.params.category_id,
      });

      if (!category) throw new Error("Category not found");

      category = await categories.findOneAndUpdate(
        {
          category_id: req.params.category_id,
        },
        {
          category_name,
        }
      );

      res.status(200).json({
        ok: true,
        message: "Category updated",
        category,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async CategoryDELETE(req, res) {
    try {
      const { category_id } = req.params;

      let productItems = await products.find({
        category_id,
      });

      for (let product of productItems) {
        const { product_id } = product;
        await product.deleteOne({
          product_id,
        });

        await product_option.deleteMany({
          product_id,
        });

        await product_images.deleteMany({
          product_id,
        });
      }

      await categories.deleteOne({
        category_id,
      });

      res.status(200).json({
        ok: true,
        message: "Category deleted",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductsGET(req, res) {
    try {
      let { c_page, p_page } = req.query;

      c_page = c_page || 1;
      p_page = p_page || 10;

      let productList = await products
        .find()
        .skip(p_page * (c_page - 1))
        .limit(p_page);

      res.status(200).json({
        ok: true,
        products: productList,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductPOST(req, res) {
    try {
      const { category_id } = req.params;
      const { product_name, price, description } = await ProductValidation(
        req.body
      );

      let slug = slugify(product_name.toLowerCase());

      let product = await products.findOne({ product_slug: slug });

      if (product) throw new Error(`Product slug ${slug} already exists`);

      let category = await categories.findOne({
        category_id,
      });

      if (!category) throw new Error("Category not found");

      product = await products.create({
        product_id: v4(),
        product_name,
        price,
        product_slug: slug,
        category_id,
        description,
      });

      if (!req.files || !req.files.image) {
        throw new Error("Image is required");
      }

      let image = req.files.image;
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
        "product_image",
        `${imageName}.${imageFormat}`
      );

      await image.mv(imagePath);

      await product_images.create({
        imge_id: v4(),
        image: `${imageName}.${imageFormat}`,
        product_id: product?._doc?.product_id,
      });

      res.status(201).json({
        ok: true,
        product,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductOptionPOST(req, res) {
    try {
      const { product_id } = req.params;
      const { key, value } = await ProductOptionValidation(req.body);

      let product = await products.findOne({
        product_id,
      });

      if (!product) throw new Error("Product not found");

      let option = await product_option.findOne({
        product_id,
        key,
      });

      if (option) throw new Error(`Option ${key} is already exists`);

      option = await product_option.create({
        product_id,
        key,
        value,
        product_option_id: v4(),
      });

      res.status(201).json({
        ok: true,
        option,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductFilterGET(req, res) {
    try {
      let { category_id, c_page, p_page } = req.params;

      c_page = c_page || 1;
      p_page = p_page || 10;

      let category = await categories.findOne({ category_id });

      if (!category) throw new Error("Category not found");

      const productItems = await products
        .find({
          category_id,
        })
        .skip(p_page * (c_page - 1))
        .limit(p_page);

      res.status(200).json({
        ok: true,
        products: productItems,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductPATCH(req, res) {
    try {
      const { product_id } = req.params;
      const { product_name, price, description } = await ProductPATCHValidation(
        req.body
      );

      let slug = slugify(product_name.toLowerCase());

      let product = await products.findOne({ product_id });

      if (!product) throw new Error("Product not found");

      const productSlug = await products.findOne({
        product_slug: slug,
        category_id,
      });

      if (productSlug && productSlug.product_id !== product.product_id) {
        throw new Error(`Product slug ${slug} already exists`);
      }

      product = await products.findOneAndUpdate(
        { product_id },
        {
          product_name,
          price,
          product_slug: slug,
          description,
          category_id,
        }
      );

      res.status(200).json({
        ok: true,
        message: "Product updated",
        product,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductDELETE(req, res) {
    try {
      const { product_id } = req.params;

      await products.deleteOne({
        product_id,
      });

      await product_option.deleteMany({
        product_id,
      });

      await product_images.deleteMany({
        product_id,
      });

      res.status(200).json({
        ok: true,
        message: "Product deleted",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ProductBestSellerPATCH(req, res) {
    try {
      let { type, cond } = req.query;
      const { product_id } = req.params;
      if (type !== "rec" && type !== "best") {
        throw new Error("Type must be 'rec' or 'best'");
      }

      if (cond != "false" && cond != "true") {
        throw new Error("Conditions must be 'true' or 'false'");
      }

      if (type == "rec") {
        await products.findOneAndUpdate(
          {
            product_id,
          },
          {
            is_rec: cond == "true" ? true : false,
          }
        );
      } else if (type == "best") {
        await products.findOneAndUpdate(
          {
            product_id,
          },
          {
            is_best: cond == "true" ? true : false,
          }
        );
      }

      res.status(200).json({
        ok: true,
        message: "Product was successfully updated",
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }
};
