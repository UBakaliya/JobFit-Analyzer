const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateJWTAccessToken } = require("../middleware/verifyToken");
require("dotenv").config();

// @desc    Auth login user
// @route   POST /api/v1/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // get one of them: email / username
    const user =
      (await User.findOne({ username: email })) ||
      (await User.findOne({ email }));

    if (!user) {
      return res
        .status(401)
        .json({ message: "username/email or password is invalid" });
    }
    const comparePass = await bcrypt.compare(password, user.password);
    // validate the password
    if (comparePass) {
      // generate jwt token
      const token = generateJWTAccessToken(user);

      // store the token in the cookies
      res.cookie("RESUME_SCANNER_AUTH_TOKEN", token, {
        httpOnly: true,
        maxAge: 12 * 60 * 60 * 1000,
      });
      
      req.user = user;
      res.json({ message: "You are logged in successfully!" });
    } else {
      return res
        .status(401)
        .json({ message: "username/email or password is invalid" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Check if the user if logged in
// @route   POST /api/v1/logged
// @access  Private
const logged = (req, res) => {
  const cookie = req.headers.cookie;
  if (cookie) {
    const token = cookie.split("=")[1];
    const match = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!match) {
      return res.status(403).json({ auth: false, message: "Not Logged in" });
    }
    return res.status(200).json({ auth: true, message: "Login" });
  }
};

// @desc    Auth register and save it to db
// @route   POST /api/v1/register
// @access  Public
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // create new user in db
    const newUser = await new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    (await newUser.save())
      ? res.json({ _id: newUser._id })
      : res.statusCode(500).json({ message: "can't add user to db" });
  } catch (error) {
    // user already excised
    error.code === 11000
      ? res.status(401).json({ message: "Username already excised" })
      : res.json({ message: error.message });
  }
};

// @desc    Auth logout user and clear the cookie from the browser
// @route   GET /api/v1/logout
// @access  Private
const logout = (req, res) => {
  res.status(200).clearCookie("jwt_token");
  res.status(200).json({ message: "Logging out..." });
};

// @desc    Auth get user account information
// @route   GET /api/v1/profile
// @access  Private
const getProfile = (req, res) => {
  try {
    const user = req.user;
    // send the data
    res.status(200).json({ email: user.email, username: user.username });
  } catch (error) {
    res.status(301).json({ message: "Can't find the user" });
  }
};

// @desc    Auth Delete user account
// @route   DELETE /api/v1/profile/delete
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const _id = req.user._id;
    const deleteUser = await User.deleteOne({ _id });
    if (deleteUser) {
      res
        .status(200)
        .clearCookie("jwt_token")
        .json({ message: "Deleted a user" });
    } else {
      res.json({ message: "Can't delete user" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};

// @desc    Auth update user password
// @route   PUT /api/v1/profile/resetpassword
// @access  Private
const resetPassword = async (req, res) => {
  try {
    const _id = req.user._id;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ message: "Invalid user Id" });
    }

    const { newPassword, oldPassword } = req.body;
    const comparePass = await bcrypt.compare(oldPassword, user.password);

    if (comparePass) {
      const updatePass = await User.updateOne(
        { _id },
        { password: await bcrypt.hash(newPassword, 10) }
      );
      if (updatePass) {
        return res.status(200).json({ message: "Password updated" });
      } else {
        return res.status(401).json({ message: "Can't update password" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Invalid Password, please enter a valid password" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  logout,
  getProfile,
  deleteProfile,
  resetPassword,
  logged,
};
