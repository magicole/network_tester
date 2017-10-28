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

module.exports.startClient = function(reverse, clientAddress, serverAddress, username, password, finishedCallback){
    var client_speed = 0;
    var client = new SSH({
	host: clientAddress,
	user: username,
	pass: password
    });

    var options = " -J";
    if(reverse){
	options += " -R";
    }
    client.exec("iperf3 -c " + serverAddress + options,{
	out: function(output){
	    //client_speed = csvParse(output, reportResults);
	    json_parsed = JSON.parse(output);
	    client_speed = reportResults(json_parsed, reverse);
	    if(typeof finishedCallback == "function"){
		finishedCallback(client_speed);
	    }
	}
    }).start();

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

module.exports.startServer = function(serverAddress, username, password, finishedCallback){
    //start server in here
    //set serverPID value
    var server = new SSH({
	host: serverAddress,
	user: username,
	pass: password
    });
    server.exec("pgrep iperf3",{
	out: function(output){serverPID = output.substring(0, output.length - 1);},
	exit: function(code){
	    if(serverPID != "0"){
		//console.log("Server already started with PID: " + serverPID);
		if(typeof finishedCallback == 'function'){
		    finishedCallback(serverPID);
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
		finishedCallback(serverPID);
	    }
	}
    });
    server.start();
};

module.exports.stopServer = function(serverAddress, username, password){
    //user serverPID with a kill
    var pid = "0";
    var server = new SSH({
	host: serverAddress,
	user: username,
	pass: password
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

