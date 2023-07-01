const User = require("../model/userSchema");
const Resume = require("../model/resumeSchema");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const scanHelper = require("../helper/scanHelper");

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

    // accept the file if it is .docx
    if (resumeFile.name.toLowerCase().includes(typeOfFileToAccept[0])) {
      // scan the .docx
      mammoth
        .extractRawText({ buffer: resumeFile.data })
        .then((result) => {
          const textContent = result.value;
          const matchRate = scanHelper(textContent, req.body.jobDescription);

          return res.status(200).json({ matchRate });
        })
        .catch((error) => {
          return res.status(400).json({ message: error });
        });
    }
    // accept the file if it is .pdf
    if (resumeFile.name.toLowerCase().includes(typeOfFileToAccept[1])) {
      pdfParse(resumeFile).then((result) => {
        // scan the pdf
        const matchRate = scanHelper(result.text, req.body.jobDescription);

        return res.status(200).json({ matchRate });
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Not a valid type of file", error: error.message });
  }
};

// @desc    Save resume
// @route   POST /api/v1/resumes/upload/:userId
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
  scan,
};
