//create web server
var http = require('http');
//create file system object
var fs = require('fs');
//create url object
var url = require('url');
//create querystring object
var querystring = require('querystring');
//create mysql object
var mysql = require('mysql');

//create connection to database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comments"
});

//connect to database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

//create server object
http.createServer(function (req, res) {
  //parse the url
  var q = url.parse(req.url, true);
  //create the path
  var filename = "." + q.pathname;
  //if the path is just a slash
  if (filename == './') {
    //set the path to index.html
    filename = './index.html';
  }
  //read the file
  fs.readFile(filename, function(err, data) {
    //if there is an error
    if (err) {
      //write the error to the page
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    //write the data to the page
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
  //if the request method is post
  if (req.method == 'POST') {
    //create body variable
    var body = '';
    //when you receive data
    req.on('data', function (data) {
        //add the data to the body
        body += data;
        //if the body is too long
        if (body.length > 1e6)
            //destroy the connection
            req.connection.destroy();
    });
    //when you finish receiving data
    req.on('end', function () {
        //parse the body
        var post = querystring.parse(body);
        //if the request is to add a comment
        if (post['action'] == 'add') {
          //create sql query
          var sql = "INSERT INTO comments (comment) VALUES ('" + post['comment'] + "');";
          //run sql query
          con.query(sql, function (err, result)