const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: String,
  attendanceList: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      status: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
