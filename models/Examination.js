const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: String,
  subjects: [
    {
      name: { type: String, required: true },
      maxMarks: { type: Number, required: true },
      passMarks: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Examination", examinationSchema);
