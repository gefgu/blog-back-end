const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  req.context.models.Post.find({})
    .populate("author")
    .exec((err, postList) => {
      if (err) return next(err);
      res.json(postList);
    });
});

module.exports = router;
