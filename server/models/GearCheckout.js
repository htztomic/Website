const mongoose = require('mongoose');
const GearCheckoutSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  ccNumber:{
    type:String,
    default:''
  },
  ccSecurityNumber :{
    type:String,
    default:''
  },
  ccExpMonth:{
    type:String,
    default:''
  },
  ccExpYear:{
    type:String,
    default:''
  },
  gearReturnDate:{
    type:Date,
    default:Date.now()
  },
  gears:[{
    gearName:{
      type:String
    },
    gearType:{
      type:String
    },
    gearPrice:{
      type:String
    },
    gearDescription:{
      type:String
    },
    gearCondition:{
      type:String
    },
    gearId:{
      type:String
    }
  }],
  damagedGear:[{
    gearName:{
      type:String
    },
    gearType:{
      type:String
    },
    gearDescription:{
      type:String
    },
    gearPrice:{
      type:String
    },
    gearCondition:{
      type:String
    },
    gearId:{
      type:String
    }
  }],
  timestamp:{
  	type: Date,
  	default: Date.now()
  },
  checkedBack: {
  	type: Boolean,
  	default: false		
  }
});

module.exports = mongoose.model('GearCheckout', GearCheckoutSchema);