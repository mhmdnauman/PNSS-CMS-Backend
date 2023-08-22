const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactInformation: String,
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  subjectsTaught: [String],
});

module.exports = mongoose.model("Teacher", teacherSchema);
