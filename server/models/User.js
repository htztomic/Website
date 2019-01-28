const mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    email: {
    type: String,	
    required: true,
    default: ''
  },
    password: {
    type: String,
    default: ''
  },
  isApproved : {
    type:Boolean,
    default:false
  },
  isAdmin: {
    type: Boolean,
    default:false
  },
    isDeleted: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
		if(err) return next(err);
		
		bcrypt.hash(user.password, salt, function(err,hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword){
	return bcrypt.compareSync(candidatePassword,this.password);
};

module.exports = mongoose.model('User', UserSchema);
