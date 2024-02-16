const {
  UsersGET,
  CreateAdminPATCH,
  UserDELETE,
  CategoryPOST,
  CategoriesGET,
  CategoryPATCH,
} = require("../controllers/AdminController");
const AdminMiddleware = require("../middlewares/AdminMiddleware");

const router = require("express").Router();

router.get("/users", AdminMiddleware, UsersGET);
router.patch("/users/make-admin/:user_id", AdminMiddleware, CreateAdminPATCH);
router.delete("/users/delete/:user_id", AdminMiddleware, UserDELETE);
router.post("/categories/create", AdminMiddleware, CategoryPOST);
router.get("/categories", AdminMiddleware, CategoriesGET);
router.patch("/categories/update/:category_id", AdminMiddleware, CategoryPATCH);

module.exports = {
  path: "/admin",
  router,
};
