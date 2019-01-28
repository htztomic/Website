const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName:{
    type:String,
    default:''
  },
  email:{
    type:String,
    default:''
  },
  phoneNumbere:{
    type:String,
    default:''
  },
  id:{
    type:String,
    default:''
  },
  isDeleted: {
  	type: Boolean,
  	default: false		
  }
});

module.exports = mongoose.model('Member', MemberSchema);