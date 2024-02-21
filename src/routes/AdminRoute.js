const {
  UsersGET,
  CreateAdminPATCH,
  UserDELETE,
  CategoryPOST,
  CategoriesGET,
  CategoryPATCH,
  CategoryDELETE,
  ProductsGET,
  ProductPOST,
  ProductPATCH,
  ProductDELETE,
  ProductFilterGET,
  ProductOptionPOST,
  ProductBestSellerPATCH,
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
router.post("/products/create/:category_id", AdminMiddleware, ProductPOST);
router.post(
  "/products/option/create/:product_id",
  AdminMiddleware,
  ProductOptionPOST
);
router.get("/products/filter/:category_id", AdminMiddleware, ProductFilterGET);
router.patch("/products/update/:product_id", AdminMiddleware, ProductPATCH);
router.delete("/products/delete/:product_id", AdminMiddleware, ProductDELETE);
router.patch(
  "/products/type/:product_id",
  AdminMiddleware,
  ProductBestSellerPATCH
);

module.exports = {
  path: "/admin",
  router,
};
