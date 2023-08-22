const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  sections: [
    {
      sectionName: { type: String, required: true },
      classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    },
  ],
});

module.exports = mongoose.model("Class", classSchema);
