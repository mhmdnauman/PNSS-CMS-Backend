const { response } = require("express");
const express = require("express");
const fetchUser = require("../Middleware/fetchUser");
const router = express.Router();
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const AttendanceTeacher = require("../models/AttendanceTeacher");


router.get(
  "/get-students",
  async (req, res) => {
    try {
      const { classId, section } = req.body;
  
      // Find the class by ID
      const selectedClass = await Class.findById(classId).populate({
        path: 'sections.students',
        select: 'firstName lastName' // Only select firstName and lastName
      });
  
      if (!selectedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Find the specific section within the class
      const selectedSection = selectedClass.sections.find(sec => sec.sectionName === section);
  
      if (!selectedSection) {
        return res.status(404).json({ message: 'Section not found in the class' });
      }
  
      // Extract student names from the selected section
      const studentNames = selectedSection.students.map(student => ({
        studentId: student._id,
        firstName: student.firstName,
        lastName: student.lastName
      }));
  
      res.status(200).json(studentNames);
    } catch (error) {
      res.status(500).json({ message: 'Error getting students', error: error.message });
    }
  }
);



router.post(
    "/student",
    async (req, res) => {
      try {
        const { classId, section, date, attendanceList } = req.body;
    
        // Find the class by ID
        const selectedClass = await Class.findById(classId);
    
        if (!selectedClass) {
          return res.status(404).json({ message: 'Class not found' });
        }
    
        // Check if the section exists in the class
        const sectionExists = selectedClass.sections.some(sec => sec.sectionName === section);
    
        if (!sectionExists) {
          return res.status(404).json({ message: 'Section not found in the class' });
        }
    
        // Get student IDs for the given section
        const studentIds = selectedClass.sections.find(sec => sec.sectionName === section).students;
    
        // Create the attendance record
        const attendance = new Attendance({
          class: classId,
          section,
          date: new Date(date),
          attendanceList: attendanceList.map(item => ({
            student: item.studentId,
            status: item.status
          }))
        });
    
        await attendance.save();
    
        res.status(201).json({ message: 'Attendance recorded successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error recording attendance', error: error.message });
      }
    }
  );

  router.get(
    "/students/get-attendance",
    async (req, res) => {
      try {
        const { classId, section, fromDate, toDate } = req.query;
    
        // Find the class by ID
        const selectedClass = await Class.findById(classId).populate({
          path: 'sections.students',
          select: 'firstName lastName' // Only select firstName and lastName
        });
    
        if (!selectedClass) {
          return res.status(404).json({ message: 'Class not found' });
        }
    
        // Find the specific section within the class
        const selectedSection = selectedClass.sections.find(sec => sec.sectionName === section);
    
        if (!selectedSection) {
          return res.status(404).json({ message: 'Section not found in the class' });
        }
    
        // Query attendance records for the section and date range
        const attendanceRecords = await Attendance.find({
          class: classId,
          section: section,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }).populate('attendanceList.student', 'firstName lastName');
    
        res.status(200).json(attendanceRecords);
      } catch (error) {
        res.status(500).json({ message: 'Error getting attendance', error: error.message });
      }
    }
  );

  router.get(
    "/teachers/get-attendance-by-student",
    async (req, res) => {
      try {
        const { studentId, fromDate, toDate } = req.query;
    
        // Find the student by ID
        const student = await Student.findById(studentId);
    
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        // Query attendance records for the student and date range
        const attendanceRecords = await Attendance.find({
          'attendanceList.student': studentId,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }).populate('class', 'className').sort({ date: 1 });
    
        res.status(200).json(attendanceRecords);
      } catch (error) {
        res.status(500).json({ message: 'Error getting attendance by student', error: error.message });
      }
    }
  );

  router.post(
    "/teacher",
    async (req, res) => {
      try {
        const { date, attendanceList } = req.body;

        // Create the attendance record
        const attendanceTeacher = new AttendanceTeacher({
          date: new Date(date),
          attendanceList: attendanceList.map(item => ({
            teacher: item.teacherId,
            status: item.status
          }))
        });
    
        await attendanceTeacher.save();
    
        res.status(201).json({ message: 'Attendance recorded successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error recording attendance', error: error.message });
      }
    }
  );

  router.get(
    "/teachers/get-attendance",
    async (req, res) => {
      try {
        const { fromDate, toDate } = req.query;
    
      
        // Query attendance records for the section and date range
        const attendanceRecords = await AttendanceTeacher.find({
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }).populate('attendanceList.student', 'firstName lastName');
    
        res.status(200).json(attendanceRecords);
      } catch (error) {
        res.status(500).json({ message: 'Error getting attendance', error: error.message });
      }
    }
  );
  
  router.get(
    "/teachers/get-attendance-by-teacher",
    async (req, res) => {
      try {
        const { teacherId,fromDate, toDate } = req.query;
    
      
        // Query attendance records for the section and date range
        const attendanceRecords = await AttendanceTeacher.find({
          'attendanceList.teacher': teacherId,
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }).populate('attendanceList.student', 'firstName lastName');
    
        res.status(200).json(attendanceRecords);
      } catch (error) {
        res.status(500).json({ message: 'Error getting attendance', error: error.message });
      }
    }
  );
  
  module.exports = router;