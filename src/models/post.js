const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  publishedDate: { type: Date, required: false },
  author: { type: Schema.types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", PostSchema);
