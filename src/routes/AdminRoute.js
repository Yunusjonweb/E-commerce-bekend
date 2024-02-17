const {
  UsersGET,
  CreateAdminPATCH,
  UserDELETE,
  CategoryPOST,
  CategoriesGET,
  CategoryPATCH,
  CategoryDELETE,
  ProductsGET,
  ProductsPOST,
} = require("../controllers/AdminController");
const AdminMiddleware = require("../middlewares/AdminMiddleware");

const router = require("express").Router();

router.get("/users", AdminMiddleware, UsersGET);
router.patch("/users/make-admin/:user_id", AdminMiddleware, CreateAdminPATCH);
router.delete("/users/delete/:user_id", AdminMiddleware, UserDELETE);
router.post("/categories/create", AdminMiddleware, CategoryPOST);
router.get("/categories", AdminMiddleware, CategoriesGET);
router.patch("/categories/update/:category_id", AdminMiddleware, CategoryPATCH);
router.delete(
  "/categories/delete/:category_id",
  AdminMiddleware,
  CategoryDELETE
);
router.get("/products", AdminMiddleware, ProductsGET);
router.post("/products/create/:category_id", AdminMiddleware, ProductsPOST);

module.exports = {
  path: "/admin",
  router,
};
