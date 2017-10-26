var Client = require('ssh2').Client;
var parse = require('csv-parse');

function reportResults(err, results){
    var speed = (results[0][8] / 1000000).toFixed(3);
    console.log("Upload speed was: " + speed + " Mbps");
}

function startClient(clientAddress, serverAddress, useKey, username, password=""){
    var iperf_c = new Client();
    iperf_c.on('ready', function(){
	console.log('Running Client Test from ' + clientAddress + ' to ' + serverAddress);
	iperf_c.exec('iperf -c ' + serverAddress + ' -y c', function(err, stream){
	    if(err){
		throw err;
	    }
	    stream.on('close', function(code, signal){
		//console.log('Stream Closed with code: ' + code + ', and signal: ' + signal);
		iperf_c.end();
	    }).on('data', function(data){
		//console.log('STDOUT: ' + data);
		parse(data, reportResults);
	    }).stderr.on('data', function(data){
		console.log('STDERR: ' + data);
	    });
	}); // finish of exec
    });

    if(useKey == 0){
	iperf_c.connect({
	    host: clientAddress,
	    port: 22,
	    username: 'pi',
	    password: 'raspberry',
	});
    }else{
	iperf_c.connect({
	    host: clientAddress,
	    port: 22,
	    username: username,
	    password: password
	});
    }
}

function startServer(serverAddress, useKey, username, password = ""){
    var iperf_s = new Client();
    iperf_s.on('error', function(err){console.log("Error from beginning: " + err);});
    iperf_s.on('ready', function(){
	console.log('Starting server on ' + serverAddress);
	console.log("check pid");
	iperf_s.exec("echo $(ps) && echo", function(err, stream){
	    if(err){
		throw err;
	    }
	    stream.on('close', function(code, signal){console.log("closing pgrep");iperf_s.end();});
	    stream.on('data', function(data){console.log("got data from pgrep: " + data + "!!")});
	    stream.stderr.on('data', function(data){console.log("got err: " + data);});
	});
	console.log("start server..");
	iperf_s.exec('iperf -s -D', function(err, stream){
	    if(err){
		throw err;
	    }
	    stream.on('close', function(code, signal){
		//console.log('Stream Closed with code: ' + code + ', and signal: ' + signal);
		iperf_s.end();
	    });
	    stream.on('data', function(data){
		console.log('STDOUT: ' + data);
		//console.log('Split output: ' + data.split(' '));
		//parse(data, reportResults);
	    });
	    stream.stderr.on('data', function(data){
		//console.log('STDERR: ' + data);
	    });
	}); // finish of exec
    });

    if(useKey == false){
	iperf_s.connect({
	    host: serverAddress,
	    port: 22,
	    username: username,
	    password: password,
	});
    }else{
	iperf_s.connect({
	    host: serverAddress,
	    port: 22,
	    username: username
	});
    }
    setTimeout(function(){console.log("waiting");}, 5000);
}

//console.log("running node...");
startServer('192.168.1.12', false, "pi", "raspberry");
//startClient('192.168.1.12', '192.168.1.10', false, "username", "password");
