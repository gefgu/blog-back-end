require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const models = require("./models");
const routes = require("./routes");

const app = express();

const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qxb9y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = { models };
  next();
});

app.use("/posts", routes.post);
app.use("/posts/:postId/comments", routes.comment);
app.use("/users", routes.user);

app.listen(3000, () => console.log("listening on port 3000"));
