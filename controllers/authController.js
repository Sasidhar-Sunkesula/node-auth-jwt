const User = require("../models/User");
const jwt = require("jsonwebtoken");
// handle errors
const handleErrors = (err) => {
  // err.code only exists for unique property's error
  console.log(err.message, err.code);
  let errors = {
    email: "",
    password: "",
  };

  // Not registered email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // Not registered email
  if (err.message === "incorrect password") {
    errors.password = "That password is not registered";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That Email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    console.log(
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      })
    );
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "sasidhar", {
    expiresIn: maxAge, // This expects is seconds
  });
};

const signup_get = (req, res) => {
  res.render("signup");
};
const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send({ errors });
  }
};
const login_get = (req, res) => {
  res.render("login");
};
const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send({ errors });
  }
};

const logout_get = (req, res) => {
  // replacing the jwt with empty as we can't delete jwt from the server.
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get,
};
