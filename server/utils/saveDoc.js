const Resume = require("../model/resumeSchema");
const jwt = require("jsonwebtoken");

// Helper function that is save the resume details to database
const saveResume = async (data, req) => {
  try {
    const userCookie = req.headers.cookie;

    // don't save the unauthenticated user information
    if (!userCookie) return;
    // console.log(userCookie);
    const { fileName, fileType } = req.body;

    // const token = userCookie.split("=")[1];
    // const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    // const newResume = await new Resume({ fileName, data, contentType, size });
    // const addResume = await User.findByIdAndUpdate(
    //   { _id: user._id },
    //   { $push: { resumes: newResume } },
    //   { new: true }
    // );
    // if (addResume) {
    //   res.json({ message: "Resume added" });
    // } else {
    //   res.json({ message: "Can't add Resume " });
    // }
  } catch (error) {
    console.log(error);
  }
};

module.exports = saveResume;
