const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json())
app.use(cors());


dotenv.config()

//Database Connection

mongoose.connect(process.env.DATABASE_ACCESS).then(()=>{

  console.log('Database Connected!');

});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


//Available Routes

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/attendance', require('./routes/attendance'));
app.use('/api/v1/class', require('./routes/class'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });