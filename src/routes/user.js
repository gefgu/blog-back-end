const express = require("express");
const { body, check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "Hello World!" });
});

module.exports = router;
