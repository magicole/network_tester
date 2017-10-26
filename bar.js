var SSH = require('simple-ssh');

var host = new SSH({
    host: "192.168.1.12",
    user: "pi",
    pass: "raspberry"
});

host.exec('pgrep iperf',{
    out: function(output){
	console.log("GOT OUTPUT: " + output);
    }
}).start();
