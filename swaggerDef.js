/**
 * @swagger
 * components:
 *   schemas:
 *     TeacherClassesSections:
 *       type: object
 *       properties:
 *         assignedClasses:
 *           type: array
 *           items:
 *             type: string
 *           description: List of assigned classes
 *         sectionsTaught:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               class:
 *                 type: object
 *                 properties:
 *                   className:
 *                     type: string
 *                 description: The class
 *               section:
 *                 type: string
 *             description: List of sections taught by the teacher
 *     AddDiary:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Diary entry date
 *         classId:
 *           type: string
 *           description: ID of the class
 *         section:
 *           type: string
 *           description: Section name
 *         subjects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               subjectName:
 *                 type: string
 *                 description: Name of the subject
 *               content:
 *                 type: string
 *                 description: Diary content
 *           description: List of subjects and their content
 *     DiaryEntry:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Diary entry date
 *         class:
 *           type: string
 *           description: ID of the class
 *         section:
 *           type: string
 *           description: Section name
 *         subjects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               subjectName:
 *                 type: string
 *                 description: Name of the subject
 *               content:
 *                 type: string
 *                 description: Diary content
 *           description: List of subjects and their content
 *     DiarySubjectEntry:
 *       type: object
 *       properties:
 *         subjectName:
 *           type: string
 *           description: Name of the subject
 *         content:
 *           type: string
 *           description: Diary content
 *     EditDiary:
 *       type: object
 *       properties:
 *         subjects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               subjectName:
 *                 type: string
 *                 description: Name of the subject
 *               content:
 *                 type: string
 *                 description: Diary content
 *           description: List of subjects and their updated content
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your Express app',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
    basePath: '/',
  };
  