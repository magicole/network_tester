var host = {
    server : {
	host : "192.168.1.12",
	userName: "pi",
	password: "raspberry"
    },
    commands : ["pgrep iperf"],
    connectedMessage: "N"
};

var SSH2Shell = require('ssh2shell'),
    SSH = new SSH2Shell(host),
    callback = function(sessionText){
	console.log("GOT MESSAGE: " + sessionText);
    };
SSH.connect(callback);
