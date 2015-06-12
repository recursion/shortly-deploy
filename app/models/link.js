var db = require('../config');
var crypto = require('crypto');

var linkSchema = db.Schema({
  url: { type: String },
  base_url: { type: String },
  code: { type: String },
  title: { type: String },
  visits: { type: Number, default: 0 },
  createdOn: { type : Date, default: Date.now }
});

// on save,
linkSchema.pre('save', function (next){
  // get SHA
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  // create hex code
  this.code = shasum.digest('hex').slice(0, 5);

  next();
});

var Link = db.model('link', linkSchema);

module.exports = Link;
