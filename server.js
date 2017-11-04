var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); //may not need this one

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

//generate routes for our api
app.get('/api/getNum', function(req, res){
    //res.send('hello');
    var foo = {foo: "bar",
	       a: "zed"};
    res.json(foo);
});
app.post('/api/test', function(req, res){
    console.log("Request body: ");
    console.log(req.body);
    res.send("foobar for you");
});
app.get('*', function(req, res){
    res.sendFile('./public/index.html');
});
	 

app.listen(8080);
console.log("server listening on 8080");
