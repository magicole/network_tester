var SSH = require('simple-ssh');
var csvParse = require('csv-parse/lib/sync');

var serverPID = 0;

function reportResults(results, reverse){
    var speed = 0;
    if(reverse){
	speed = (results.end.sum_sent.bits_per_second / 1000000).toFixed(3);
    }else{
	speed = (results.end.sum_received.bits_per_second / 1000000).toFixed(3);
    }
    
    //console.log("Upload speed was: " + speed + " Mbps");
    return speed;
}

module.exports.startClient = function(testParams, finishedCallback){
    var client_speed = 0;
    if(testParams.clientUsername == undefined){
	console.log("Params where bug:");
	console.log(testParams);
	console.log(reverse);
	console.log(finishedCallback);
    }
    var client = new SSH({
	host: testParams.clientIP,
	user: testParams.clientUsername,
	pass: testParams.clientPassword
    });

    var options = " -J";
    if(testParams.reverse){
	options += " -R";
    }
    client.exec("iperf3 -c " + testParams.serverIP + options,{
	out: function(output){
	    //client_speed = csvParse(output, reportResults);
	    json_parsed = JSON.parse(output);
	    console.log("Parsed Json");
	    client_speed = reportResults(json_parsed, testParams.reverse);
	    console.log("check" + client_speed);
	    // if(json_parsed.end.sum_sent != undefined){
	    // 	client_speed = reportResults(json_parsed, testParams.reverse);
	    // }else{
	    // 	client_speed = "ERROR";
	    // 	console.log(json_parsed);
	    // }
	    if(typeof finishedCallback == "function"){
		console.log("calling callback");
		finishedCallback(testParams, client_speed);
	    }else{
		console.log("callback of type: " + typeof finishedCallback);
	    }
	}
	});
	
	client.start({
		fail: function(){
			console.log("could not connect to client");
			finishedCallback(testParams, -1);
			return -1;
		}
	});

    return client_speed;
};

function getServerPID(serverAddress, username, password){
    var server = new SSH({
	host: serverAddress,
	user: username,
	pass: password
    });

    var pid = 0;
    
    server.exec("pgrep iperf3", {
	out: function(output){
	    pid = output.substring(0, output.length - 1);
	    console.log("Got this as PID: " + encodeURI(output.substring(0, output.length - 1)));
	    console.log(typeof(pid));
	    return pid;
	}
	}).start();
	
    //return pid;
}

module.exports.startServer = function(testParams, finishedCallback){
    //start server in here
    //set serverPID value
    var server = new SSH({
	host: testParams.serverIP,
	user: testParams.serverUsername,
	pass: testParams.serverPassword
    });
    serverPID = 0;
    server.exec("pgrep iperf3",{
	out: function(output){serverPID = output.substring(0, output.length - 1);},
	exit: function(code){
	    if(serverPID != "0"){
		//console.log("Server already started with PID: " + serverPID);
		if(typeof finishedCallback == 'function'){
		    finishedCallback(testParams, serverPID);
		}
		return false; // cancel the current exec stack 
	    }
	}
    });
    server.exec("iperf3 -s -D");
    server.exec("pgrep iperf3",{
		out: function(output){
			serverPID = output.substring(0, output.length -1);
			//console.log("Server started with PID: " + serverPID);
			if(typeof finishedCallback == 'function'){
			finishedCallback(testParams, serverPID);
			}
	}
    });
    server.start({
		fail: function(){
			console.log("could not connect to server");
			finishedCallback(testParams, -1);
		}
	});
};

module.exports.stopServer = function(testParams){
    //user serverPID with a kill
    var pid = "0";
    var server = new SSH({
	host: testParams.serverIP,
	user: testParams.serverUsername,
	pass: testParams.serverPassword
    });

    server.exec("pgrep iperf3",{
	out: function(output){pid = output.substring(0, output.length - 1);},
	exit: function(code){
	    if(pid != "0"){
		server.exec("kill " + pid);
		//console.log("killing PID: " + pid);
		return false;
	    }
	}
    }).start();
};

