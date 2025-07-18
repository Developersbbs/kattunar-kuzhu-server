const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  memberLimit:{type:Number,required:true},
  gdLeader:{type:String,required:true},
  status:{
    type:String,
    enum:['active','inactive'],
    default:'active'
  }
},{
    timestamps:true
});

module.exports = mongoose.model('Group', groupSchema);
