const router = require("express").Router();
const {
  login,
  register,
  logout,
  getProfile,
  deleteProfile,
  resetPassword,
  loggedIn,
} = require("../controller/authController");
const { validateToken } = require("../middleware/verifyToken");

router.post("/login", login);

router.post("/register", register);

router.get("/loggedin", loggedIn);

router.get("/logout", validateToken, logout);

router.get("/profile", validateToken, getProfile);

router.delete("/profile/delete/", validateToken, deleteProfile);

router.put("/profile/resetpassword/", validateToken, resetPassword);

module.exports = router;
