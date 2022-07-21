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
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pellentesque vehicula leo, id posuere massa dignissim et. Maecenas tempus enim et consectetur pellentesque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur malesuada mi lacus, at gravida est semper eu. In faucibus dictum efficitur. Aliquam erat volutpat. In varius leo eget nisi finibus ultricies. Ut ex est, lobortis in augue sit amet, dictum euismod diam. Donec sit amet nisl nulla. Suspendisse eleifend aliquam libero sed placerat. Quisque malesuada, nisl eu mollis convallis, velit justo malesuada neque, quis molestie lorem nisi feugiat dui. Aliquam ullamcorper sollicitudin rutrum. Nulla auctor metus elit, ac rhoncus purus cursus vitae. Mauris accumsan pharetra diam euismod feugiat. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          
          Quisque sodales neque neque, consequat porta sem egestas eu. Maecenas varius vitae orci auctor pulvinar. Morbi dictum fringilla nibh vitae porta. Etiam ut felis placerat, porta nibh ac, semper erat. Suspendisse vestibulum nibh a massa dictum lacinia. Vestibulum vehicula tincidunt urna, sit amet aliquam erat. Vestibulum hendrerit, ex vel gravida vestibulum, ex tellus lacinia justo, at pulvinar mi nunc consectetur magna. Aenean malesuada metus quis metus maximus tempor. Sed vestibulum est at sapien facilisis pharetra. Nulla feugiat neque eget vestibulum suscipit. Suspendisse sed porttitor metus, ac iaculis purus. Donec sed laoreet mauris. Vestibulum justo lectus, rhoncus eget dictum eu, lacinia quis nisl.
          
          Aliquam hendrerit justo lorem, venenatis lobortis tortor convallis nec. Nunc ullamcorper porta ipsum, in cursus tortor posuere a. Quisque fermentum justo nec elit vestibulum, at auctor risus ultrices. Etiam hendrerit ex non bibendum mattis. Proin dictum ut nulla a auctor. Mauris aliquet, quam eu vulputate ultricies, nulla lectus volutpat lectus, eget consectetur libero velit sed nibh. Curabitur nec eleifend sem, ac imperdiet diam. Nulla vestibulum neque sed ullamcorper cursus. Nullam nec hendrerit libero, non eleifend dolor. Nulla et aliquam tortor.
          
          Nam non est eget ligula tincidunt pretium. Nullam ornare purus sed nulla auctor porta. Cras a feugiat mauris. Aenean aliquam, mi in dapibus tristique, felis arcu aliquet lacus, at accumsan ligula purus et dui. Donec venenatis ornare sapien, sollicitudin luctus eros consectetur sit amet. Nunc ultrices nibh in nibh porttitor lobortis. Vivamus lacinia sem vitae lorem volutpat, et ornare tortor interdum. Vivamus mi odio, fermentum at massa et, imperdiet congue ipsum. Vivamus at placerat arcu. Aliquam imperdiet quam nulla, vitae dictum ligula scelerisque nec. Suspendisse vitae pulvinar est. Phasellus sollicitudin gravida auctor. Etiam semper velit id interdum vulputate. Vivamus eget nunc lorem.
          
          Cras non aliquam ante. Suspendisse faucibus eu ante in fermentum. Cras dapibus libero eget nunc bibendum, eget mattis lectus aliquam. Cras rhoncus imperdiet elit eu interdum. Pellentesque elementum felis ut condimentum fermentum. Donec non vulputate metus. Donec quis auctor metus. Cras volutpat tincidunt ante vitae dictum. Etiam scelerisque auctor urna sit amet congue. Sed quis ullamcorper ipsum. Duis rhoncus iaculis quam non mollis. Nulla sit amet elementum ligula.`,
          Date.now(),
          Date.now(),
          users[1],
          callback
        ),
      (callback) =>
        createPost(
          // Taken from https://www.theodinproject.com/lessons/nodejs-blog-api
          "Post #2",
          `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pellentesque vehicula leo, id posuere massa dignissim et. Maecenas tempus enim et consectetur pellentesque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur malesuada mi lacus, at gravida est semper eu. In faucibus dictum efficitur. Aliquam erat volutpat. In varius leo eget nisi finibus ultricies. Ut ex est, lobortis in augue sit amet, dictum euismod diam. Donec sit amet nisl nulla. Suspendisse eleifend aliquam libero sed placerat. Quisque malesuada, nisl eu mollis convallis, velit justo malesuada neque, quis molestie lorem nisi feugiat dui. Aliquam ullamcorper sollicitudin rutrum. Nulla auctor metus elit, ac rhoncus purus cursus vitae. Mauris accumsan pharetra diam euismod feugiat. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          
          Quisque sodales neque neque, consequat porta sem egestas eu. Maecenas varius vitae orci auctor pulvinar. Morbi dictum fringilla nibh vitae porta. Etiam ut felis placerat, porta nibh ac, semper erat. Suspendisse vestibulum nibh a massa dictum lacinia. Vestibulum vehicula tincidunt urna, sit amet aliquam erat. Vestibulum hendrerit, ex vel gravida vestibulum, ex tellus lacinia justo, at pulvinar mi nunc consectetur magna. Aenean malesuada metus quis metus maximus tempor. Sed vestibulum est at sapien facilisis pharetra. Nulla feugiat neque eget vestibulum suscipit. Suspendisse sed porttitor metus, ac iaculis purus. Donec sed laoreet mauris. Vestibulum justo lectus, rhoncus eget dictum eu, lacinia quis nisl.
          
          Aliquam hendrerit justo lorem, venenatis lobortis tortor convallis nec. Nunc ullamcorper porta ipsum, in cursus tortor posuere a. Quisque fermentum justo nec elit vestibulum, at auctor risus ultrices. Etiam hendrerit ex non bibendum mattis. Proin dictum ut nulla a auctor. Mauris aliquet, quam eu vulputate ultricies, nulla lectus volutpat lectus, eget consectetur libero velit sed nibh. Curabitur nec eleifend sem, ac imperdiet diam. Nulla vestibulum neque sed ullamcorper cursus. Nullam nec hendrerit libero, non eleifend dolor. Nulla et aliquam tortor.
          
          Nam non est eget ligula tincidunt pretium. Nullam ornare purus sed nulla auctor porta. Cras a feugiat mauris. Aenean aliquam, mi in dapibus tristique, felis arcu aliquet lacus, at accumsan ligula purus et dui. Donec venenatis ornare sapien, sollicitudin luctus eros consectetur sit amet. Nunc ultrices nibh in nibh porttitor lobortis. Vivamus lacinia sem vitae lorem volutpat, et ornare tortor interdum. Vivamus mi odio, fermentum at massa et, imperdiet congue ipsum. Vivamus at placerat arcu. Aliquam imperdiet quam nulla, vitae dictum ligula scelerisque nec. Suspendisse vitae pulvinar est. Phasellus sollicitudin gravida auctor. Etiam semper velit id interdum vulputate. Vivamus eget nunc lorem.
          
          Cras non aliquam ante. Suspendisse faucibus eu ante in fermentum. Cras dapibus libero eget nunc bibendum, eget mattis lectus aliquam. Cras rhoncus imperdiet elit eu interdum. Pellentesque elementum felis ut condimentum fermentum. Donec non vulputate metus. Donec quis auctor metus. Cras volutpat tincidunt ante vitae dictum. Etiam scelerisque auctor urna sit amet congue. Sed quis ullamcorper ipsum. Duis rhoncus iaculis quam non mollis. Nulla sit amet elementum ligula. `,
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
