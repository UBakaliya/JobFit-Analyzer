const User = require("../model/userSchema");
const Resume = require("../model/resumeSchema");

// @desc    Save resume
// @route   POST /api/v1/resumes/:userId
// @access  Private
const postResume = async (req, res) => {
  const { filename, data, contentType, size } = req.body;

  try {
    const newResume = await new Resume({ filename, data, contentType, size });

    const addResume = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $push: { resumes: newResume } },
      { new: true }
    );

    if (addResume) {
      res.json({ message: "Resume added" });
    } else {
      res.json({ message: "Can't add Resume " });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

// @desc    user/resumes/get resume
// @route   GET /api/v1/resumes/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.json({ message: "Can't find user" });

    const resume = user.resumes.find(
      (item) => item._id.toString() === req.params.id
    );
    if (resume === undefined) {
      res.json({ message: "Can't find resume" });
    }
    res.json(resume);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// @desc    user/resumes/get all resumes
// @route   GET /api/v1/resumes/
// @access  Private
const getResumes = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.json({ message: "Can't find user" });
    res.json(user.resumes);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// @desc    user/resumes/ Remove all the resumes
// @route   DELETE /api/v1/resumes/
// @access  Private
const deleteResumes = async (req, res) => {
  try {
    const deleteAll = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $unset: { resumes: 1 } },
      { new: true }
    );
    if (!deleteAll) {
      return res.json({ message: "Can't delete all resumes" });
    }
    res.json({ message: "All resumes are deleted" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// @desc    user/resumes/get resume
// @route   DELETE /api/v1/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.json({ message: "Can't find user" });

    const filterResume = user.resumes.filter(
      (resume) => resume._id.toString() != req.params.id
    );

    user.resumes = filterResume;
    if (await user.save()) res.json({ resumes: filterResume });
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  getResume,
  postResume,
  getResumes,
  deleteResumes,
  deleteResume,
};
