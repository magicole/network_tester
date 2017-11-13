var iperf = require('./iperf3_utils.js');
var WebSocket = require('ws');
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

var wss = new WebSocket.Server({port: 8081});

//var response;

function runClient(testParams, pid){
    console.log("iperf3 Server started with PID: " + pid);
    //response.send("server");
    iperf.startClient(testParams, stopServer);
    console.log("starting client");
}

function stopServer(testParams, speed){
    console.log("Upload speed was: " + speed + " Mbps");
    console.log("Stopping Server");
    //response.send("client");
    iperf.stopServer(testParams);
    //response.send({"upload": speed});
    testParams.res.send({"upload": speed});
}

function runTest(testParams){
    console.log("test initiated");
    iperf.startServer(testParams, runClient);
}

//generate routes for our api
app.get('/api/getNum', function(req, res){
    //res.send('hello');
    var foo = {foo: "bar",
	       a: "zed"};
    res.json(foo);
});

app.post('/api/runTest', function(req, res){
    //console.log("Got Test request with data:");
    //console.log(req.body);
    
    //testParams = req.body;
    var tp = req.body;
    tp.res = res;
    runTest(tp);
    //res.send({"upload": 42});
});

app.get('*', function(req, res){
    res.sendFile('./public/index.html');
});
	 

app.listen(8080);
console.log("server listening on 8080");
