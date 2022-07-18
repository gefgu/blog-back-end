const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  req.context.models.Comment.find({})
    .populate("author")
    .exec((err, commentList) => {
      if (err) return next(err);
      res.json(commentList);
    });
});

module.exports = router;
