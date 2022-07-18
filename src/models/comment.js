const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Comment", CommentSchema);
