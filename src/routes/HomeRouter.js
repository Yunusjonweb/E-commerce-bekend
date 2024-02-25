const HomeController = require("../controllers/HomeController");
const {
  ProductsGET,
  CartAddPOST,
  CartPlusPATCH,
  CartMinusPATCH,
  ProductsSearchGET,
  CartGET,
  ProductGET,
  CommentPOST,
} = require("../controllers/ProductController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const router = require("express").Router();

router.get("/", HomeController);
router.get("/products/search", ProductsSearchGET);
router.get("/products/:category_id", ProductsGET);
router.get("/cart", AuthMiddleware, CartGET);
router.get("/product/:product_slug", ProductGET);

router.post("/products/cart/:product_id", AuthMiddleware, CartAddPOST);
router.post("/products/comment/:product_id", AuthMiddleware, CommentPOST);
router.patch("/products/cart/plus/:product_id", AuthMiddleware, CartPlusPATCH);
router.patch(
  "/products/cart/minus/:product_id",
  AuthMiddleware,
  CartMinusPATCH
);

module.exports = {
  path: "/",
  router,
};
