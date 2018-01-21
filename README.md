# Simple Network Tester App

This is a simple web throughput testing app utilizing iperf3 through a node web app. 

## Requirements and Installation

### Requirements 

This app requires nodejs on the server where it will be hosted. It also requires that iperf3 is installed on all machines that testing is to be done through. SSH access is required to access each of these machines. 

### Installation

1. Clone this repo to your desired location

```bash
git clone https://github.com/magicole/network_tester.git
```

2. Enter the network_tester repo and install npm dependencies

```bash
cd network_tester
npm install
```

## Running the Web App

To start the app at localhost:8080 run

```bash
npm start
```

## Running a Throughput Test

Once the app is started, go to http://localhost:8080 in your browser of choice. 

Enter in the IP, username, and password for the computers on the network that you want to run the test between. Select what type of test you want to do (upload or download) and press Start Test. Tests take about 15 seconds to run.

If the app cannot connect to the server or client machine, a warning will apear to the user. 
