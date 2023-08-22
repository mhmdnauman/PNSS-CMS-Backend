const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');

app.use(express.json())
app.use(cors());


dotenv.config()

//Database Connection

mongoose.connect(process.env.DATABASE_ACCESS).then(()=>{

  console.log('Database Connected!');

});


//Available Routes

app.use('/api/v1/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });