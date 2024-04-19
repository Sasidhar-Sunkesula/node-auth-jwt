const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    // unique doesn't have have a custom message instead it has error code
    unique: true,
    lowercase: true,
    // 1st arg of validate is a validation function it has access to the user entered value and the 2nd ar is an error message
    validate: [isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// post save event occurs do this
userSchema.post("save", function (doc, next) {
  console.log("created", doc);
  next();
});

// fire a function before doc is saved to db. this is the local instance before we are saving to the db, we don't have access to doc here
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email }); // this refers to the model but not instance, it is same as await User
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
