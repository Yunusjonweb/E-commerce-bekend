const { checkToken } = require("../modules/jwt");

module.exports = async function (req, res, next) {
  try {
    let token = req?.cookies?.token || req?.headers["authorization"];
    token = checkToken(token);

    if (!token) {
      res.redirect("/users/login");
      return;
    }

    req.user = token;

    next();
  } catch (e) {}
};
