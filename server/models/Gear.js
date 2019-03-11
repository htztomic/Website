const mongoose = require('mongoose');

const GearSchema = new mongoose.Schema({
  gearName: {
    type: String,
    default: ''
  },
  gearType: {
    type: String,
    default: ''
  },
  gearPrice: {
    type: String,
  },
  gearDescription:{
    type:String,
  },
  gearCondition:{
    type:String
  },
  timestamp:{
  	type: Date,
  	default: Date.now()
  },
  removed:{
    type:Boolean,
    default:false
  },
  checkedOut: {
  	type: Boolean,
  	default: false		
  },
  barcode: {
    type: String,
    default: ''    
  }
});

module.exports = mongoose.model('Gear', GearSchema);