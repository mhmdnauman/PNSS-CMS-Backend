const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  registrationNumber: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  gender: String,
  contactInformation: String,
  address: String,
  parentDetails: String,
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: String,
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Student", studentSchema);
