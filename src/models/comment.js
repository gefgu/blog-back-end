const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  post: { type: Schema.types.ObjectId, ref: "Post" },
  author: { type: Schema.types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Comment", CommentSchema);
