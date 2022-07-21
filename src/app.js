require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const models = require("./models");
const routes = require("./routes");
const passport = require("passport");
const jwtStrategy = require("./strategies/jwt");
const compression = require("compression");
const { default: helmet } = require("helmet");
const cors = require("cors");

const app = express();
passport.use(jwtStrategy);

const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qxb9y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(helmet());

app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.use((req, res, next) => {
  req.context = { models };
  next();
});

app.use("/posts", routes.post);
app.use("/posts/:postId/comments", routes.comment);
app.use("/users", routes.user);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(process.env.PORT || 8080, () => console.log("Server Started"));
