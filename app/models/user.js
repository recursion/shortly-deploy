// var db = require('../config');
var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = db.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

// attach methods to schema
userSchema.methods.hashPassword = function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    })
    .then(function(){
      next();
    });
};

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

// setup pre-save behavior
userSchema.pre('save', function (next) {
  var user = this;

  // create hashed password
  user.hashPassword(next);
});

var User = db.model('User', userSchema);

module.exports = User;

