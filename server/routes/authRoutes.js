const router = require("express").Router();
const {
  login,
  register,
  logout,
  getProfile,
  deleteProfile,
  resetPassword,
  logged,
} = require("../controller/authController");
const { validateToken } = require("../middleware/verifyToken");

router.post("/login", login);

router.post("/register", register);

router.get("/logged", validateToken, logged);

router.post("/logout", validateToken, logout);

router.get("/profile", validateToken, getProfile);

router.delete("/profile/delete/", validateToken, deleteProfile);

router.put("/profile/resetpassword/", validateToken, resetPassword);

module.exports = router;
