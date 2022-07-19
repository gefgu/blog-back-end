const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", [
  body("username", "username must be specified").trim().isLength().escape(),
  body("username", "username already in use").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      req.context.models.User.findOne({ username: value }, (err, user) => {
        if (user) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }),
  body("password", "password must be bcrypt hashed value").trim().isLength(60), // Length of Bcrypt hashed password
  body("admin", "admin must be specified").isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const user = new req.context.models.User({
      username: req.body.username,
      password: req.body.password,
      admin: req.body.admin,
    });

    user.save(function (err) {
      if (err) return next(err);

      res.json({ message: "USER CREATED WITH SUCCESS!", user });
    });
  },
]);

router.post("/login", (req, res, next) => {
  const {username, password } = req.body;
  req.context.models.User.findOne(
    { username: username },
    (err, user) => {
      if (err) return next(err);
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const opts = {};
            opts.expiresIn = 60 * 60 * 24; // token expires in 1 day.
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, opts);
            return res.status(200).json({ message: "AUTHORIZED", token });
          } else {
            return res.status(401).json({ message: "WRONG PASSWORD" });
          }
        });
      } else {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
    }
  );
});

module.exports = router;
