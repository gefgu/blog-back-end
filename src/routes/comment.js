const express = require("express");
const { body, check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", (req, res, next) => {
  req.context.models.Comment.find({})
    .populate("author")
    .exec((err, commentList) => {
      if (err) return next(err);
      res.json(commentList);
    });
});

router.post("/", [
  body("content", "content must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("creationDate", "creationDate must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "author must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check("author").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      req.context.models.User.findById(value, (err, user) => {
        if (user) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }),
  body("post", "post must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check("post").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      req.context.models.Post.findById(value, (err, post) => {
        if (post) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const comment = new req.context.models.Comment({
      content: req.body.content,
      creationDate: req.body.creationDate,
      author: req.body.author,
      post: req.body.post,
    });

    comment.save(function (err) {
      if (err) return next(err);

      res.json({ message: "COMMENT CREATED WITH SUCCESS!", comment });
    });
  },
]);

module.exports = router;
