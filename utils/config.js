require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI||"mongodb://localhost:27017/kattanurkuzhu";
const PORT = process.env.PORT|| 3000;
const JWT_SECRET=process.env.JWT_SECRET;

module.exports ={
  MONGODB_URI,
  PORT,
  JWT_SECRET
}