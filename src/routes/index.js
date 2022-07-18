const { model } = require("mongoose");
const post = require("./post");
const comment = require("./comment");
const user = require("./user");

module.exports = {
  post,
  comment,
  user,
};
