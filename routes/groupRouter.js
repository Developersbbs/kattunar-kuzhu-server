const express =require("express");
const groupController=require("../controllers/groupController")
const groupRouter=express.Router();

groupRouter.get('/:groupName', groupController.getUsersByGroupName);
groupRouter.get('/', groupController.getAllGroups);
groupRouter.post('/', groupController.createGroup);



module.exports=groupRouter;