const {
  SignUpController,
  VerifyEmailController,
  LoginController,
} = require("../controllers/UsersController");

const router = require("express").Router();

router.post("/signup", SignUpController);
router.post("/login", LoginController);
router.get("/verify/:user_id", VerifyEmailController);

module.exports = {
  path: "/users",
  router,
};
