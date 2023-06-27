const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    resumes: mongoose.Schema.Types.Array,
  },

  { collection: "users_auth+data" },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
