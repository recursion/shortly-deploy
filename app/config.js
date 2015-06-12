var mongoose = require('mongoose');

// TODO: check for dev or production environment
var db = mongoose.connect('mongodb://localhost/shortly');

// export mongoose??
module.exports = db;
