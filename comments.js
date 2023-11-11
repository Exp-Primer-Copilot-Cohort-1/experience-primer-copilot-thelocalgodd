//create web server
var express = require('express');
var router = express.Router();
var db = require('../models/db');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
var bcrypt = require('bcrypt');
var saltRounds = 10;

// Path: /comments/
// Method: GET
// Description: get all comments
router.get('/', function(req, res) {
    if(req.session.user) {
      db.Comment.find({}, function(err, comments) {
        if(err) {
          res.send(err);
        } else {
          res.json(comments);
        }
      });
    } else {
      res.send("You are not logged in");
    }
});

// Path: /comments/:id
// Method: GET
// Description: get comment by id
router.get('/:id', function(req, res) {
    if(req.session.user) {
      db.Comment.findById(req.params.id, function(err, comment) {
        if(err) {
          res.send(err);
        } else {
          res.json(comment);
        }
      });
    } else {
      res.send("You are not logged in");
    }
});

// Path: /comments/
// Method: POST
// Description: create new comment
router.post('/', urlencodedParser, function(req, res) {
    if(req.session.user) {
      var comment = new db.Comment({
        text: req.body.text,