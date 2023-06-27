const router = require("express").Router();
const validateToken = require("../middleware/verifyToken");
const {
  getResume,
  postResume,
  getResumes,
  deleteResumes,
  deleteResume,
} = require("../controller/resumesController");

router.get("/:userId/:id", validateToken, getResume);

router.get("/:userId", validateToken, getResumes);

router.post("/:userId", validateToken, postResume);

router.delete("/:userId", validateToken, deleteResumes);

router.delete("/:userId/:id", validateToken, deleteResume);

module.exports = router;
