var mongoose = require('mongoose');

// TODO: check for dev or production environment
var db = mongoose.connect('mongodb://localhost/shortly');

var host = process.env.DB || 'mongodb://localhost/shortly';
var db = mongoose.connect(host);

// export mongoose??
module.exports = db;
