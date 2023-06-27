const router = require("express").Router();
const {
  login,
  register,
  logout,
  getProfile,
  deleteProfile,
  resetPassword,
} = require("../controller/authController");
const validateToken = require("../middleware/verifyToken");

router.post("/login", login);

router.post("/register", register);

router.get("/logout", validateToken, logout);

router.get("/profile/:id", validateToken, getProfile);

router.delete("/profile/delete/:id", validateToken, deleteProfile);

router.put("/profile/resetpassword/:id", validateToken, resetPassword);

module.exports = router;
