const mongoose = require("mongoose");

const ResumeSchema = mongoose.Schema(
  {
    fileName: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }

  // { timestamps: true }
);
const Resume = mongoose.model("Resume", ResumeSchema);

module.exports = Resume;
