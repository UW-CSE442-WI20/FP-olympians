

// You can require libraries
const d3 = require('d3');
const _ = require("underscore")

// Global variables
var entriesBySport = null;
var entriesByCountryThenSport = null;
var entriesBySportThenCountryThenYear = null;
var entriesBySportByYearMedalCount = null;

// Include local JS files:
const BigChart = require('./bigChart');
const SmallChart = require('./smallChart');
const bigChartInstance = new BigChart();
const smallChartInstance = new SmallChart();

// create svg for smallChart
const smallsvg = d3.select('#smallchart')
           .append('svg')
           .attr('width', 1200)
           .attr('height', 460);

// create svg for bigChart
const bigsvg = d3.select('#bigchart')
          .append('svg')
          .attr('width', 1200)
          .attr('height', 380);


// draw small chart elements here
var topRanks = [1,2,3];  // Basic Test Example
// draw the three top rank elements
smallChartInstance.drawTopRanks(smallsvg, topRanks);

// bigChartInstance.drawChart(bigsvg);

function initializeDropdowns() {
	var select = document.getElementById("select-sport");
	console.log(entriesBySport);
	for (var index in entriesBySport) {
		select.options[select.options.length] = new Option(entriesBySport[index].key, index);
	}
	// add event listener to find out when the sport changes
	select.addEventListener('change', function() {
	var currSport = document.getElementById('select-sport');
	bigChartInstance.redraw(bigsvg, entriesBySportByYearMedalCount[currSport.value].values)
	})
}

function initializeData(data) {
	data.forEach(function(d) {
		d.ID = +d.ID;
		d.Age = +d.Age;
		d.Year = +d.Year;
		d.Order = +d.Order;
	})

  entriesByCountryThenSport = d3.nest()
    .key(function(d) {
      return d.Team;
    })
    .key(function(d) {
      return d.Sport;
    })
    .entries(data);

	entriesBySport = d3.nest()
		.key(function(d) {
			return d.Sport;
		})
		.sortKeys(d3.ascending)
		.entries(data);

	entriesBySportByYearMedalCount = d3.nest()
		.key(function(d) {
			return d.Sport;
		})
		.key(function(d) {
			return d.Team;
		})
		.key(function(d) {
			return d.Year;
		}).sortKeys(d3.ascending)
		.rollup(function(v) { return d3.sum(v, function(d) { return d.Medal.length > 0 ? 1 : 0})})
		.entries(data);

	entriesBySportThenCountryThenYear = d3.nest()
		.key(function(d) {
			return d.Sport;
		})
		.sortKeys(d3.ascending)
		.key(function(d) {
			return d.Team;
		})
		.sortKeys(d3.ascending)
		.key(function(d) {
			return d.Year;
		})
		.sortKeys(d3.ascending)
		.entries(data)

  // entriesBySportByYearMedalRankings = d3.nest()
  //   .key(function(d) {
  //     return d.Sport;
  //   })
  //   .key(function(d) {
  //     return d.Year;
  //   })
  //   .sortKeys(d3.ascending)
  //   .key(function(d) {
  //     return d.Team;
  //   })
  //   .rollup(function(v) { return d3.sum(v, function(d) { return d.Medal.length > 0 ? 1 : 0 })})
  //   .entries(data)





	// const countByYearByCountry = _.countBy(yearByCountry, function(item) {
	// 	console.log(item);
	// 	return item.Team;
	// })

	// console.log("**********************")
	// console.log(countByYearByCountry);
	// console.log("**********************")
}

// Function that returns sorted order of countries based on medals for that sport in 2016
function createRanking(sport) {

	var currSportOnly = entriesBySportByYearMedalCount[0].values;


	console.log("**********************")
	console.log(currSportOnly);
	console.log("**********************")
	console.log("passing into bigchart DrawChart");
	bigChartInstance.drawChart(bigsvg, currSportOnly);
	//
	// console.log(yearByCountry);
	// // go over each year and give a ranking on who had the most medals that year
	// console.log(typeof(yearByCountry));
	// var countryToMedalsPerYear = {}
	// for (let [key, value] of Object.entries(yearByCountry)) {
	// 	var medalCount = _.countBy(value, function(item) {
	// 		return item.Team;
	// 	});
	// }
	// yearByCountry.forEach(function(key) {
	// 	var val = yearByCountry[key];
	// 	const countEachCountry = _.countBy(val, function(item) {
	// 		item.Team;
	// 	})
	// 	console.log( key + ": " + countEachCountry);
	// })

}

// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('olympics.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
    initializeData(data);
	initializeDropdowns();
	createRanking("Archery");
  });

  // You can load JSON files directly via require.
  // Note this does not add a network request, it adds
  // the data directly to your JavaScript bundle.
  // const exampleData = require('./example-data.json');
