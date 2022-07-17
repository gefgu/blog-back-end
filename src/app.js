require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qxb9y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => res.json({ message: "abc" }));

app.listen(3000, () => console.log("listening on port 3000"));
