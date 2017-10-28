var iperf = require('./iperf3_utils.js');

function runClient(pid){
    console.log("iperf3 Server started with PID: " + pid);
    iperf.startClient(true, "192.168.1.10", "192.168.1.12", "cole", "StrangeBrew", stopServer);
}

function stopServer(speed){
    console.log("Upload speed was: " + speed + " Mbps");
    console.log("Stopping Server");
    iperf.stopServer("192.168.1.12", "pi", "raspberry");
}
iperf.startServer("192.168.1.12", "pi", "raspberry", runClient);
