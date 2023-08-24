const swaggerAutogen = require('swagger-autogen')()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDef = require('./swaggerDef');

// const options = {
//     swaggerDefinition: swaggerDef,
//     apis: ['./routes/attendance.js', './routes/auth.js', './routes/class.js', './routes/dailyDiary.js'],
//   };
  const endpointsFiles = ['./routes/attendance.js', './routes/auth.js', './routes/class.js', './routes/dailyDiary.js']
  swaggerAutogen(outputFile, endpointsFiles)
  
//   const specs = swaggerJsdoc(options);

  const outputFile = './swagger_output.json'

  module.exports = specs;
