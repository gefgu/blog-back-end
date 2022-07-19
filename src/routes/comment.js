const express = require("express");
const { body, check, validationResult } = require("express-validator");
const passport = require("passport");

const router = express.Router();

router.get("/", (req, res, next) => {
  req.context.models.Comment.find({})
    .populate("author")
    .exec((err, commentList) => {
      if (err) return next(err);
      res.json(commentList);
    });
});

router.post("/", passport.authenticate("jwt", { session: false }), [
  body("content", "content must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("creationDate", "creationDate must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("post", "post must be specified").trim().isLength({ min: 1 }).escape(),
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
      author: req.user._id,
      post: req.body.post,
    });

    comment.save(function (err) {
      if (err) return next(err);

      res.json({ message: "COMMENT CREATED WITH SUCCESS!", comment });
    });
  },
]);

router.get("/:commentId", (req, res, next) => {
  req.context.models.Comment.findById(req.params.commentId)
    .populate("author")
    .exec((err, comment) => {
      if (err) return next(err);
      res.json(comment);
    });
});

router.delete(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // Even if comment doesn't belong to postId, it will be deleted - Implementation detail
    req.context.models.Comment.findById(req.params.commentId)
      .populate("author")
      .exec((err, comment) => {
        if (err) return next(err);
        if (
          comment.author._id.toString() !== req.user._id.toString() &&
          !req.user.admin
        ) {
          return next();
        }
        req.context.models.Comment.findByIdAndRemove(
          req.params.commentId,
          (err) => {
            if (err) return next(err);
            res.json({ message: "COMMENT DELETED WITH SUCCESS!", comment });
          }
        );
      });
  }
);

module.exports = router;
