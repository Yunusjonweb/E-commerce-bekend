const categories = require("../model/CategoryModel");
const users = require("../model/UserModel");
const CategoryValidation = require("../validations/CategoryValidation");
const { v4 } = require("uuid");

module.exports = class AdminController {
  static async UsersGET(req, res) {
    try {
      let customers = await users.find();
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
      console.log(e + "");
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
      console.log(e + "");
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
        category: category,
      });
    } catch (e) {
      res.status(404).json({
        ok: false,
        message: e + "",
      });
    }
  }
};
