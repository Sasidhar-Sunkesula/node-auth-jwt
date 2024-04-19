const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleWare");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const app = express();

// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

// database connection
const port = 3000;
mongoose
  .connect(process.env.dbURI)
  .then(() => {
    console.log("Connected to db");
    app.listen(port, () => {
      console.log(`On port ${port}`);
    });
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies
// app.get("/set-cookies", (req, res) => {
//   res.cookie("newUser", true);
//   res.cookie("isEmployee", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//     secure: true,
//   });
//   res.send("Congrats");
// });

// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// });
