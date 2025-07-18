const express =require("express");
const app=express();
const cookieParser=require('cookie-parser');
const morgan=require('morgan');
const cors=require('cors');
const authRouter = require("./routes/authRouter");
const meetingRouter=require("./routes/meetingRouter");
const groupRouter=require("./routes/groupRouter");
const requirementRouter=require("./routes/requirementRouter");

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
  origin:'*',
  credentials:true,
}));

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/meeting",meetingRouter);
app.use("/api/v1/group",groupRouter);
app.use("/api/v1/requirements",requirementRouter)



module.exports=app;
