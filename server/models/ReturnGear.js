const mongoose = require('mongoose');

const ReturnGearSchema = new mongoose.Schema({
  comment: {
    type: String,
    default: ''
  },
  checkoutId :{
    type:String,
    default: ''
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  gearInfo:
  {
  },
  gears:[],
  timestamp:{
  	type: Date,
  	default: Date.now()
  },
  cleared: {
  	type: Boolean,
  	default: false		
  }
});

module.exports = mongoose.model('ReturnGear', ReturnGearSchema);