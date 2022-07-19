const express = require("express");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const router = express.Router();

router.get("/", (req, res, next) => {
  req.context.models.Post.find({})
    .populate("author")
    .exec((err, postList) => {
      if (err) return next(err);
      if (postList === null) {
        const err = new Error("Post List not found");
        err.status = 404;
        return next(err);
      }
      res.json(postList);
    });
});

router.post("/", passport.authenticate("jwt", { session: false }), [
  body("title", "Title must be specified").trim().isLength({ min: 1 }).escape(),
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

    const post = new req.context.models.Post({
      title: req.body.title,
      content: req.body.content,
      publishDate: req.body.publishDate || null,
      author: req.user._id,
    });

    post.save(function (err) {
      if (err) return next(err);

      res.json({ message: "POST CREATED WITH SUCCESS!", post });
    });
  },
]);

router.get("/:postId", (req, res, next) => {
  req.context.models.Post.findById(req.params.postId)
    .populate("author")
    .exec((err, post) => {
      if (err) return next(err);
      if (post === null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
      res.json(post);
    });
});

router.put("/:postId", passport.authenticate("jwt", { session: false }), [
  body("title", "Title must be specified").trim().isLength({ min: 1 }).escape(),
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

    const post = new req.context.models.Post({
      _id: req.params.postId,
      title: req.body.title,
      content: req.body.content,
      publishDate: req.body.publishDate || null,
      author: req.user._id,
    });

    req.context.models.Post.findByIdAndUpdate(
      req.params.postId,
      post,
      {},
      function (err) {
        if (err) return next(err);

        if (post === null) {
          const err = new Error("Post not found");
          err.status = 404;
          return next(err);
        }

        res.json({ message: "POST UPDATED WITH SUCCESS!", post });
      }
    );
  },
]);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    req.context.models.Post.findById(req.params.postId)
      .populate("author")
      .exec((err, post) => {
        if (err) return next(err);

        if (post === null) {
          const err = new Error("Post not found");
          err.status = 404;
          return next(err);
        }

        req.context.models.Post.findByIdAndRemove(req.params.postId, (err) => {
          if (err) return next(err);
          res.json({ message: "POST DELETED WITH SUCCESS!", post });
        });
      });
  }
);

module.exports = router;
