const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateJWTAccessToken } = require("../middleware/verifyToken");
require("dotenv").config();

// @desc    Login user
// @route   POST /api/v1/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // get one of them: email/username
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
      res
        .cookie("JOBFIT_ANALYZER_AUTH_TOKEN", token, {
          maxAge: 12 * 60 * 60 * 1000, // 12 hours max age
          httpOnly: true,
        })
        .json({ message: "You are logged in successfully!", token: token });
    } else {
      return res
        .status(401)
        .json({ message: "username/email or password is invalid" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Check if the user is logged in
// @route   GET /api/v1/loggedin
// @access  Public
const loggedIn = (req, res) => {
  try {
    const cookie = req.cookies.JOBFIT_ANALYZER_AUTH_TOKEN;
    if (!cookie)
      return res.json({ auth: false, message: "No cookie in the headers" });

    const match = jwt.verify(cookie, process.env.JWT_SECRET_KEY);
    if (match) {
      res.status(200).json({ auth: true, message: "Login" });
    }
  } catch (error) {
    res.json({ auth: false, message: "Not Logged in user" });
  }
};

// @desc    Register new user and save the user details
// @route   POST /api/v1/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // create new user in db
    const newUser = await new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    (await newUser.save())
      ? res
          .status(200)
          .json({ message: "Success! Your signup process is complete!" })
      : res.statusCode(500).json({ message: "can't add user to db" });
  } catch (error) {
    // user already exists
    error.code === 11000
      ? res.status(401).json({
          message:
            "This username or email is already in use. Please choose a different one.",
        })
      : res.json({ message: error.message });
  }
};

// @desc    Auth logout user and clear the cookie from the browser
// @route   GET /api/v1/logout
// @access  Private
const logout = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("JOBFIT_ANALYZER_AUTH_TOKEN")
      .json({ message: "Logging out..." });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// @desc    Get user account details
// @route   GET /api/v1/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // send the data
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({ message: "Invalid user _id, can't file the user" });
    }
    res.status(200).json({ email: user.email, username: user.username });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/profile/delete
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const _id = req.user._id;
    const deleteUser = await User.deleteOne({ _id });
    if (deleteUser) {
      res
        .status(200)
        .clearCookie("JOBFIT_ANALYZER_AUTH_TOKEN")
        .json({ message: "User is Deleted successfully" });
    } else {
      res.json({ message: "User deletion failed. Please try again later" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// @desc    Update user password
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
  loggedIn,
};
