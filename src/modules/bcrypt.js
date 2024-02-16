const bcrypt = require("bcrypt");

module.exports.generateHash = async function (pass) {
  let salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pass, salt);
};

module.exports.compareHash = async function (pass, hash) {
  return await bcrypt.compare(pass, hash);
};
