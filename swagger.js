const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/attendance.js', './routes/auth.js', './routes/class.js', './routes/dailyDiary.js']

swaggerAutogen(outputFile, endpointsFiles)