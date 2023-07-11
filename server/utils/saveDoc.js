const Resume = require("../model/resumeSchema");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

// Helper function that is save the resume details to database
const saveResume = async (req) => {
  try {
    const userCookie = req.headers.cookie;

    // don't save the unauthenticated user information
    if (!userCookie) return;

    const { fileSize, fileType } = req.body;

    const token = userCookie.split("=")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    // invalid user token don't save the user information
    if (!user) return;

    const newResume = await new Resume({
      fileName: req.files.resumeFile.name,
      data: req.files.resumeFile.data,
      contentType: fileType,
      size: fileSize,
    });

    // save the use data
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $push: { resumes: newResume } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = saveResume;
