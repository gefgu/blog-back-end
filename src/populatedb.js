#! /usr/bin/env node

console.log(
  "This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let users = [];
let posts = [];
let comments = [];

function createUser(name, password, admin, callback) {
  const user = new User({ name, password, admin });

  user.save(function (err) {
    if (err) {
      callback(err);
      return;
    }
    console.log(`New User: ${user}`);
    users.push(user);
    callback(null, user);
  });
}

function createPost(
  title,
  content,
  creationDate,
  publishedDate,
  author,
  callback
) {
  const post = new Post({
    title,
    content,
    creationDate,
    publishedDate,
    author,
  });

  post.save(function (err) {
    if (err) {
      callback(err);
      return;
    }
    console.log(`New Post: ${post}`);
    posts.push(post);
    callback(null, post);
  });
}

function createComment(content, creationDate, post, author, callback) {
  const comment = new Comment({
    content,
    creationDate,
    post,
    author,
  });

  comment.save(function (err) {
    if (err) {
      callback(err);
      return;
    }
    console.log(`New Comment: ${comment}`);
    comments.push(comment);
    callback(null, comment);
  });
}
