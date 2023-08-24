const mongoose = require("mongoose");

const attendanceTeacherSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendanceList: [
    {
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },
      checkIn: { type: Date },
      checkOut: { type: Date },
      status: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("AttendanceTeacher", attendanceTeacherSchema);
