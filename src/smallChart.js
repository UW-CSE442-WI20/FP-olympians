

// You can separate your code out into modules to
// keep code clean.

// Todo: implement the small chart with a ctor?

// class smallChart {
// 	// create a chart object that takes in certain parameters
// 	constructor() {

// 	}
// }

const d3 = require("d3");

function createSmallChart() {
	var margin = {top: 10, right: 30, bottom: 30, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var svg = d3.select('#smallchart')
		.append("svg")
	    	.attr("width", width + margin.left + margin.right)
	    	.attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    	.attr("transform",
	        	  "translate(" + margin.left + "," + margin.top + ")");
}

module.exports = smallChart;
