const router = require("express").Router();
const { validateToken } = require("../middleware/verifyToken");
const {
  getResume,
  getResumes,
  deleteResumes,
  deleteResume,
  scan,
} = require("../controller/resumesController");

router.get("/:id", validateToken, getResume);

router.get("/", validateToken, getResumes);

router.post("/scan", scan);

router.delete("/", validateToken, deleteResumes);

router.delete("/:id", validateToken, deleteResume);

module.exports = router;
