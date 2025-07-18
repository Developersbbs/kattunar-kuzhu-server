const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content:{type:String,required:true},
  target_group:{type:String,required:true},
  priority:{
    type:String,
    enum:['high','medium','low'],
    default:'high'
  }
},{
    timestamps:true
});

module.exports = mongoose.model('Announcement', announcementSchema);
