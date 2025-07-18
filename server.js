const mongoose = require('mongoose');
const {MONGODB_URI, PORT} = require('./utils/config');
const app = require('./app');
require('dotenv').config();

console.log('Connecting to DB....');
mongoose.connect(MONGODB_URI)
.then(()=> {
  console.log('DB connected successfully');

  //Start the server
  app.listen(PORT, ()=>{
    console.log(`Server is running @ http://localhost:${PORT}`);
  })
})
.catch((err)=>{
  console.log(`Error in DB connection: ${err.message}`);
})