const User = require("../model/userSchema");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const scanHelper = require("../utils/scanHelper");
const saveResume = require("../utils/saveDoc");

// @desc    Scan resume and compare it with the give job description
// @route   POST /api/v1/resumes/scan
// @access  Public
const scan = (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const typeOfFileToAccept = [".docx", ".pdf"];
    const resumeFile = req.files.resumeFile;

    // save the user resume if the user is logged in
    saveResume(req);

    // accept the file if it is .docx
    if (resumeFile.name.includes(typeOfFileToAccept[0])) {
      // scan the .docx
      mammoth
        .extractRawText({ buffer: resumeFile.data })
        .then((result) => {
          const textContent = result.value;

          // get the match rate
          const matchRate = scanHelper(textContent, req.body.jobDescription);

          res.status(200).json({ matchRate });
        })
        .catch((error) => {
          res.status(400).json({ message: error });
        });
    }
    // accept the file if it is .pdf
    if (resumeFile.name.includes(typeOfFileToAccept[1])) {
      pdfParse(resumeFile).then((result) => {
        // scan the pdf
        const matchRate = scanHelper(result.text, req.body.jobDescription);
        res.status(200).json({ matchRate });
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Please provide following types of documents: PDF, DOCX",
      error: error.message,
    });
  }
};

// @desc    user/resumes/get resume
// @route   GET /api/v1/resumes/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
    const user = await User.findById(req.user._id);

    const sortedResumes = user.resumes.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    if (!user) return res.json({ message: "Can't find user" });
    res.json({ resumes: sortedResumes });
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
      { _id: req.user._id },
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
    const user = await User.findById(req.user._id);
    if (!user) return res.json({ message: "Can't find user" });

    const filterResume = user.resumes.filter(
      (resume) => resume._id.toString() != req.params.id
    );

    user.resumes = filterResume;
    const updateResumeArr = await user.save();
    if (updateResumeArr) {
      res.status(200).json({ message: `Resume ${req.params.id} is deleted` });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  getResume,
  getResumes,
  deleteResumes,
  deleteResume,
  scan,
};
