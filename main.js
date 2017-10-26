var iperf = require('./iperf_utils.js');
//iperf.startClient("192.168.1.12", "192.168.1.10", "pi", "raspberry");
//iperf.startServer("192.168.1.12", "pi", "raspberry");
iperf.stopServer("192.168.1.12", "pi", "raspberry");
