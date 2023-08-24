const { response } = require("express");
const express = require("express");
const fetchUser = require("../Middleware/fetchUser");
const router = express.Router();
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const AttendanceTeacher = require("../models/AttendanceTeacher");
const swaggerAutogen = require('swagger-autogen')();

/**
 * @swagger
 * /get-students:
 *   get:
 *     summary: Get students for a class and section
 *     parameters:
 *       - name: classId
 *         in: query
 *         required: true
 *         type: string
 *       - name: section
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 */

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


/**
 * @swagger
 * /student:
 *   post:
 *     summary: Record student attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Successful response
 */

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


  /**
 * @swagger
 * /students/get-attendance:
 *   get:
 *     summary: Get student attendance records for a class and section
 *     parameters:
 *       - name: classId
 *         in: query
 *         required: true
 *         type: string
 *       - name: section
 *         in: query
 *         required: true
 *         type: string
 *       - name: fromDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *       - name: toDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: Successful response
 */


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

  /**
 * @swagger
 * /teachers/get-attendance-by-student:
 *   get:
 *     summary: Get teacher attendance records for a student
 *     parameters:
 *       - name: studentId
 *         in: query
 *         required: true
 *         type: string
 *       - name: fromDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *       - name: toDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: Successful response
 */

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

 // Check-In endpoint

/**
 * @swagger
 * /teacher/checkin:
 *   post:
 *     summary: Record teacher check-in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherCheckin'
 *     responses:
 *       201:
 *         description: Successful response
 */



router.post("/teacher/checkin", async (req, res) => {
  try {
    const { date, checkInList } = req.body;

    await Promise.all(checkInList.map(async item => {
      await AttendanceTeacher.updateOne(
        { date, "attendanceList.teacher": item.teacherId },
        { $set: { "attendanceList.$.checkIn": new Date(item.checkInTime) } }
      );
    }));

    res.status(201).json({ message: 'Check-in recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording check-in', error: error.message });
  }
});

// Check-Out endpoint

/**
 * @swagger
 * /teacher/checkout:
 *   post:
 *     summary: Record teacher check-out
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherCheckout'
 *     responses:
 *       201:
 *         description: Successful response
 */

router.post("/teacher/checkout", async (req, res) => {
  try {
    const { date, checkOutList } = req.body;

    await Promise.all(checkOutList.map(async item => {
      const checkInAttendance = await AttendanceTeacher.findOne(
        { date, "attendanceList.teacher": item.teacherId }
      );

      if (!checkInAttendance) {
        // Teacher's check-in attendance not found
        return;
      }

      const teacherAttendance = checkInAttendance.attendanceList.find(teacher => teacher.teacher.toString() === item.teacherId);
      if (!teacherAttendance) {
        // Teacher's attendance data not found
        return;
      }

      const checkInTime = teacherAttendance.checkIn;
      const checkOutTime = new Date(item.checkOutTime);

      const timeDifference = checkOutTime - checkInTime;

      if (timeDifference >= 21600000) {
        // Teacher present
        teacherAttendance.status = 'present';
      } else {
        // Teacher absent
        teacherAttendance.status = 'absent';
      }

      teacherAttendance.checkOut = checkOutTime;
      await checkInAttendance.save();
    }));

    res.status(201).json({ message: 'Check-out recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording check-out', error: error.message });
  }
});

/**
 * @swagger
 * /teachers/get-attendance:
 *   get:
 *     summary: Get teacher attendance records
 *     parameters:
 *       - name: fromDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *       - name: toDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: Successful response
 */

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
  

  /**
 * @swagger
 * /teachers/get-attendance-by-teacher:
 *   get:
 *     summary: Get teacher attendance records for a specific teacher
 *     parameters:
 *       - name: teacherId
 *         in: query
 *         required: true
 *         type: string
 *       - name: fromDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *       - name: toDate
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: Successful response
 */

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