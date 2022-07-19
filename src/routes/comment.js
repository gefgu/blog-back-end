const express = require("express");
const { body, check, validationResult } = require("express-validator");
const passport = require("passport");

const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
  req.context.models.Post.findById(req.params.postId).exec((err, post) => {
    if (err) return next(err);
    if (post === null) {
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }
    req.post = post;
    return next();
  });
});

router.get("/", (req, res, next) => {
  req.context.models.Comment.find({ post: req.post._id })
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const comment = new req.context.models.Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.post._id,
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
      if (comment === null) {
        const err = new Error("Comment not found");
        err.status = 404;
        return next(err);
      }
      if (comment.post._id.toString() !== req.post._id.toString()) {
        const err = new Error("Comment not found in this post");
        err.status = 404;
        return next(err);
      }
      res.json(comment);
    });
});

router.delete(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    req.context.models.Comment.findById(req.params.commentId)
      .populate("author")
      .exec((err, comment) => {
        if (err) return next(err);
        if (comment === null) {
          const err = new Error("Comment not found");
          err.status = 404;
          return next(err);
        }
        if (comment.post._id.toString() !== req.post._id.toString()) {
          const err = new Error("Comment not found in this post");
          err.status = 404;
          return next(err);
        }
        if (
          comment.author._id.toString() !== req.user._id.toString() &&
          !req.user.admin
        ) {
          const err = new Error("Unauthorized");
          err.status = 401;
          return next(err);
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
