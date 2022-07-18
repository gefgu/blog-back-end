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
const bcrypt = require("bcryptjs");
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

function createUser(username, password, admin, callback) {
  const user = new User({ username, password, admin });

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

function populateUsers(callback) {
  async.series(
    [
      (callback) => {
        bcrypt.hash("password7", 10, (err, hashedPassword) => {
          if (err) return callback(err);
          createUser("jeff", hashedPassword, true, callback);
        });
      },
      (callback) => {
        bcrypt.hash("password7", 10, (err, hashedPassword) => {
          if (err) return callback(err);
          createUser("john", hashedPassword, false, callback);
        });
      },
    ],
    callback
  );
}

function populatePosts(callback) {
  async.series(
    [
      (callback) =>
        createPost(
          // Taken from https://www.tiny.cloud/docs/tinymce/6/
          "Post #1",
          `<div class="paragraph">
    <p>The output created is in HTML5 and can include lists, tables, and other useful elements, depending on your configuration. The functionality of the editor can be extended through plugins and customizations, or limited to suit your use-case. TinyMCE can also be customized to look and feel like part of your application or webpage by customizing the user interface. TinyMCE can be integrated into a range of frameworks and Content Management Systems (CMSs), and can be either:</p>
    </div>
    <div class="ulist">
    <ul>
    <li>
    <p>Loaded from the Tiny Cloud CDN (Content Delivery Network), which will ensure TinyMCE is always using the latest version.</p>
    </li>
    <li>
    <p>Installed with a package manager (self-hosted).</p>
    </li>
    <li>
    <p>Extracted from a .zip file (self-hosted).</p>
    </li>
    </ul>
    </div>
    <p><span style="text-decoration: underline;"><strong>&nbsp;</strong></span></p>`,
          Date.now(),
          Date.now(),
          users[1],
          callback
        ),
      (callback) =>
        createPost(
          // Taken from https://www.theodinproject.com/lessons/nodejs-blog-api
          "Post #2",
          `<div id="introduction" class="scrollspy">
        <h3><a class="internal-link" href="https://www.theodinproject.com/lessons/nodejs-blog-api#introduction">Introduction</a></h3>
        <p>Do you know what you need? You need a Blog. Or maybe you don&rsquo;t, or maybe you already have one, in any case, this project will be a great way to practice and see the benefits of creating an API only backend. We&rsquo;re actually going to create the backend and <em>two</em> different front-ends for accessing and editing your blog posts. One of the front-end sites will be for people that want to read and comment on your posts while the other one will be just for you to write, edit and publish your posts.</p>
        <p>Why are we setting it up like this? Because we can! If you already have a portfolio site and you want to add your blog posts to that site feel free to do that instead of creating a new site just for that. The important exercise here is setting up the API and then accessing it from the outside. There are some security benefits to setting up separate websites for blog consumption and blog editing, but really we&rsquo;re just doing it like this to demonstrate the power and flexibility of separating your backend code from your frontend code.</p>
        </div>`,
          Date.now(),
          null,
          users[1],
          callback
        ),
    ],
    callback
  );
}

function populateComments(callback) {
  async.series(
    [
      (callback) =>
        createComment("Fun!", Date.now(), posts[0], users[1], callback),
      (callback) =>
        createComment("Nice!", Date.now(), posts[0], users[1], callback),
      (callback) =>
        createComment("Wow!", Date.now(), posts[1], users[1], callback),
      (callback) =>
        createComment(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nibh orci, interdum nec ligula non, pharetra consectetur nulla. Aliquam ultrices nulla et mi efficitur, et rhoncus tellus congue. Nunc sit amet feugiat urna. Phasellus tempus porttitor enim, eget posuere enim ultricies eget. Nullam eget mauris sodales, vehicula arcu eu, accumsan odio. In tempus malesuada risus, sed placerat lorem vehicula vel. Aenean consectetur orci nec ante consequat, sed tempor enim posuere. Vivamus tempor diam in neque venenatis, in aliquam nunc vulputate. Donec porttitor tincidunt egestas. Vestibulum ut dictum ipsum. Sed elementum molestie dignissim. Nullam dapibus convallis dui, sit amet sodales massa mattis eget. Nulla aliquet orci eget nisi dignissim tincidunt. Cras viverra rhoncus leo, ac aliquet odio interdum sit amet. Suspendisse pretium congue enim id imperdiet. Sed quis nibh at risus dictum venenatis eget eget mi.",
          Date.now(),
          posts[0],
          users[1],
          callback
        ),
      (callback) =>
        createComment(
          "Fusce at maximus tellus. Vivamus id sem pulvinar, cursus libero ac, ultrices lorem. Cras non aliquam lectus. Vestibulum lobortis velit nec arcu maximus, faucibus sagittis ipsum molestie. Phasellus erat orci, mattis accumsan dolor in, tristique fermentum sem. Praesent a risus et lorem molestie dapibus. Nam aliquet lectus ac quam vulputate malesuada. Quisque vel nibh laoreet, volutpat metus facilisis, tempor dolor. Phasellus faucibus dignissim efficitur. Phasellus orci ex, molestie id ligula ut, elementum maximus nisi. ",
          Date.now(),
          posts[1],
          users[1],
          callback
        ),
    ],
    callback
  );
}

async.series(
  [populateUsers, populatePosts, populateComments],
  function (err, results) {
    if (err) console.log("Final ERR: " + err);

    mongoose.connection.close();
  }
);
