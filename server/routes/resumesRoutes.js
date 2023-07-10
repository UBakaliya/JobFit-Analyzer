const router = require("express").Router();
const { validateToken } = require("../middleware/verifyToken");
const {
  getResume,
  getResumes,
  deleteResumes,
  deleteResume,
  scan,
} = require("../controller/resumesController");

router.get("/:userId/:id", validateToken, getResume);

router.get("/:userId", validateToken, getResumes);

// router.post("/upload", validateToken, postResume);

router.post("/scan", scan);

router.delete("/:userId", validateToken, deleteResumes);

router.delete("/:userId/:id", validateToken, deleteResume);

module.exports = router;
