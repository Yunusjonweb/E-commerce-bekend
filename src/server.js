const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const CookieParser = require("cookie-parser");
const { PORT } = require("../config");
const mongoose = require("./modules/mongo");
const cors = require("cors");
const compression = require("compression");
const FileUpload = require("express-fileupload");

const app = express();

app.listen(PORT, () => {
  console.log(`SERVER READY AT localhost://${PORT}`);
});

mongoose();

app.use(compression());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(FileUpload());
app.use(morgan("tiny"));
app.use("/public", express.static(path.join(__dirname, "public")));

fs.readdir(path.join(__dirname, "routes"), (err, files) => {
  if (!err) {
    files.forEach((file) => {
      const routePath = path.join(__dirname, "routes", file);
      const Route = require(routePath);
      if (Route.path && Route.router)
        app.use(`/api${Route.path}`, Route.router);
    });
  }
});

app.use((err, req, res, next) => {
  let statusCode = err.status || 500;

  // Set the status code based on the error type or use 500 for unhandled errors
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request for validation errors
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401; // Unauthorized access
  }
  return res
    .status(statusCode)
    .json({ success: false, msg: err.message || "Internal Server Error" });
});
