const mongoose = require("mongoose");

const ResumeSchema = mongoose.Schema(
  {
    filename: { type: String, required: true },
    data: Buffer,
    contentType: String,
    size: Number,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);
const Resume = mongoose.model("Resume", ResumeSchema);

module.exports = Resume;
