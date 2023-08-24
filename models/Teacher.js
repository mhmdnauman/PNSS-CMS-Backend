const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  sectionsTaught: [
    {
      class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
      section: String,
    },
  ],
  subjectsTaught: [String],
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  qualification: { type: String, required: true },
  address: { type: String },
  password: { type: String, required: true }
});

module.exports = mongoose.model("Teacher", teacherSchema);
