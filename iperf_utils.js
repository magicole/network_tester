var SSH = require('simple-ssh');
var csvParse = require('csv-parse');

var serverPID = 0;

function reportResults(err, results){
    var speed = (results[0][8] / 1000000).toFixed(3);
    console.log("Upload speed was: " + speed + " Mbps");
    return speed;
}

module.exports.startClient = function(clientAddress, serverAddress, username, password){
    var client_speed = 0;
    var client = new SSH({
	host: clientAddress,
	user: username,
	pass: password
    });

    client.exec("iperf -c " + serverAddress + " -y C",{
	out: function(output){
	    client_speed = csvParse(output, reportResults);
	    flag = 1;
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
    
    server.exec("pgrep iperf", {
	out: function(output){
	    pid = output.substring(0, output.length - 1);
	    console.log("Got this as PID: " + encodeURI(output.substring(0, output.length - 1)));
	    console.log(typeof(pid));
	    return pid;
	}
    }).start();
    //return pid;
}

module.exports.startServer = function(serverAddress, username, password){
    //start server in here
    //set serverPID value
    var server = new SSH({
	host: serverAddress,
	user: username,
	pass: password
    });
    server.exec("pgrep iperf",{
	out: function(output){serverPID = output.substring(0, output.length - 1);},
	exit: function(code){
	    if(serverPID != "0"){
		console.log("Server already started with PID: " + serverPID);
		return false; // cancel the current exec stack 
	    }
	}
    });
    server.exec("iperf -s -D");
    server.exec("pgrep iperf",{
	out: function(output){
	    serverPID = output.substring(0, output.length -1);
	    console.log("Server started with PID: " + serverPID);
	}
    });
    server.start();
};

module.exports.stopServer = function(serverAddress, username, password){
    //user serverPID with a kill -9
    var pid = "0";
    var server = new SSH({
	host: serverAddress,
	user: username,
	pass: password
    });

    server.exec("pgrep iperf",{
	out: function(output){pid = output.substring(0, output.length - 1);},
	exit: function(code){
	    if(pid != "0"){
		server.exec("kill -9 " + pid);
		console.log("killing PID: " + pid);
		return false; // if we didn't get any PID back, don't try to kill anything
	    }
	}
    }).start();
};

