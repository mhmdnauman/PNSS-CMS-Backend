const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subjectResults: [
    {
      subject: { type: String, required: true },
      marksObtained: { type: Number, required: true },
      grade: String,
      remarks: String,
    },
  ],
  totalMarks: Number,
  percentage: Number,
});

module.exports = mongoose.model("Result", resultSchema);
