const express =require("express");
const authController=require('../controllers/authController');

const authRouter=express.Router();

authRouter.post('/register',authController.register);
authRouter.post('/superadmin',authController.superAdmin);
authRouter.get('/superadmin/members', authController.getAllMembers);
authRouter.put('/superadmin/approve/:memberId', authController.approveMember);



module.exports=authRouter;