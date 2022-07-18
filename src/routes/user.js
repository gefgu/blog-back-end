const express = require("express");
const { body, check, validationResult } = require("express-validator");

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

module.exports = router;
