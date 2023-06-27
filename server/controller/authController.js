const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Auth login user
// @route   POST /api/v1/login
// @access  Public
const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // get one of them: email / username
    const user =
      (await User.findOne({ username })) || (await User.findOne({ email }));

    if (!user) {
      return res.json({ error: "Username / Password is invalid" });
    }

    // validate the password
    if (await bcrypt.compare(password, user.password)) {
      // store the token in the cookies
      jwt.sign(
        { user },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "12h" },
        (err, token) => {
          if (err) throw err;
          res.cookie("jwt_token", token, {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.json({ _id: user._id })
        }
      );
    } else {
      return res.json({ error: "Username / Password is invalid" });
    }
  } catch (error) {
    throw new Error(error.message);
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
      : res.statusCode(500).json({ error: "can't add user to db" });
  } catch (error) {
    // user already excised
    error.code === 11000
      ? res.json({ error: "Username already excised" })
      : res.json({ error });
  }
};

// @desc    Auth logout user and clear the cookie from the browser
// @route   GET /api/v1/logout
// @access  Private
const logout = (req, res) => {
  res.clearCookie("jwt_token");
  res.json({ response: "Logging out..." });
};

// @desc    Auth get user account information
// @route   GET /api/v1/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send({ username: user.username, email: user.email });
  } catch (error) {
    res.json({ error: "Can't find the user" });
  }
};

// @desc    Auth Delete user account
// @route   DELETE /api/v1/profile/delete
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const deleteUser = await User.deleteOne({ _id: req.params.id });
    if (deleteUser) {
      res.clearCookie("jwt_token");
      res.json({ message: "Deleted a user" });
    } else {
      res.json({ error: "Can't delete user" });
    }
  } catch (error) {
    res.json(error);
  }
};

// @desc    Auth update user password
// @route   PUT /api/v1/profile/resetpassword
// @access  Private
const resetPassword = async (req, res) => {
  try {
    const updatePass = await User.updateOne(
      { _id: req.params.id },
      { password: await bcrypt.hash(req.body.newPassword, 10) }
    );
    if (updatePass) {
      res.clearCookie("jwt_token");
      res.json({ message: "Password updated" });
    } else res.json({ error: "Can't update user password" });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  login,
  register,
  logout,
  getProfile,
  deleteProfile,
  resetPassword,
};
