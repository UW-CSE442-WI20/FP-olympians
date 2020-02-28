

// You can require libraries
const d3 = require('d3');

// Global variables
var entriesBySport = null;

// Include local JS files:
const BigChart = require('./bigChart');
const SmallChart = require('./smallChart');
const bigChartInstance = new BigChart();
const smallChartInstance = new SmallChart();

// create svg for smallChart
const smallChartDiv = d3.select('#smallchart')

// create svg for bigChart
const bigsvg = d3.select('#bigchart')
          .append('svg')
          .attr('width', 1200)
          .attr('height', 380);

function initializeDropdowns() {
	var select = document.getElementById("select-sport");
	console.log(entriesBySport);
	for (var index in entriesBySport) {
		select.options[select.options.length] = new Option(entriesBySport[index].key, index);
	}
}

function initializeData(data) {
	data.forEach(function(d) {
		d.ID = +d.ID;
		d.Age = +d.Age;
		d.Year = +d.Year;
		d.Order = +d.Order;
	})

	entriesBySport = d3.nest()
		.key(function(d) {
			return d.Sport;
		})
		.sortKeys(d3.ascending)
		.entries(data);
}

// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('olympics.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
    initializeData(data);
    initializeDropdowns();
    // draw small chart elements here
	var topRanks = [1,2,3];  // Basic Test Example
	// draw the three top rank elements
	smallChartInstance.drawTopRanks(smallChartDiv, topRanks, data);
  });

  // You can load JSON files directly via require.
  // Note this does not add a network request, it adds
  // the data directly to your JavaScript bundle.
  // const exampleData = require('./example-data.json');
