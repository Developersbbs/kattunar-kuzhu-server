const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  Content:{type:String,required:true},
  Target_Group:{type:String,required:true},
  priority:{
    type:String,
    enum:['high','medium','low'],
    default:'high'
  }
},{
    timestamps:true
});

module.exports = mongoose.model('Announcement', announcementSchema);
