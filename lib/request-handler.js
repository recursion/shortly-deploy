var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links) {
    if (err) {
      return console.error(err);
    }
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({url: uri}, function(err, link){
    if (!link) {

      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        // create new link
        newLink = new Link({url: uri, base_url: req.headers.origin, title: title});
        newLink.save(function(err, results){
          res.send(200, results);
        });
      });

    } else {
      res.send(200, link);
    }
  })

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, result){
    if (err) {
      return console.error(err);
    }
    // not found
    if (!result) {
      res.redirect('/login');
    } else { // found

      result.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, result);
        } else {
          res.redirect('/login');
        }
      });


    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, result){
    if (!result) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, savedUser){
        util.createSession(req, res, savedUser);
      });

    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link){
    if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      console.log(link);
      link.save();
      return res.redirect(link.get('url'));
    }
  });

};
