var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
	labels: ["11/12", "11/13", "11/14", "11/15"],
	datasets: [
	    {label: "Mbps",
	     data: [20, 10, 25, 67],
	     backgroundColor: "rgba(153, 255, 51, 0)",
	     borderColor: "rgba(100, 23, 200, 0.8)"
	    }
	]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
