

// You can require libraries
const d3 = require('d3');
const _ = require("underscore");

// Global variables
var entriesBySport = null;
var entriesBySportByYearMedalCount = null;
var currSport = null;

// Include local JS files:
const BigChart = require('./bigChart');
const RankRows = require('./rankRows');
const bigChartInstance = new BigChart();


// create svg for smallChart (the entire rank rows area)
const rankRowsDiv = d3.select('#rankings');

// create all of the rank rows (3 is number of results to display)
// ** will want to add data as a parameter
const rankRows = new RankRows(rankRowsDiv, 10);

// create svg for bigChart
const bigsvg = d3.select('#bigchart')
          .append('svg')
          .attr('width', "1000")
          .attr('height', 380);

function initializeDropdowns() {
	var select = document.getElementById("select-sport");
	console.log(entriesBySport);
  for (var index in entriesBySport) {
  	select.options[select.options.length] = new Option(entriesBySport[index].key, index);
	}
	// add event listener to find out when the sport changes
	select.addEventListener('change', function() {
	    currSport = document.getElementById('select-sport');
      console.log("curr sport:", entriesBySportByYearMedalCount[currSport.value].key);
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

// DO THIS ONE

    entriesBySportByYearByCountryRatio = d3.nest()
  		.key(function(d) {
  			return d.Sport;
  		})
  		.key(function(d) {
  			return d.Year;
  		})
      .key(function(d) {
        return d.Team;
      })
      .sortKeys(d3.ascending)
  		// .rollup(function(v) {
      //   if (d3.sum(v, function(d) { return 1; }) === 0) {
      //       // if there are 0 athletes for that sport-year-country, immediately return 0
      //       return 0;
      //   }
      //   return d3.sum(v, function(d) {
      //       // return the sum of the medals / the total number of athletes who participated that year
      //       // Tricky part: counting distinct athletes
      //       return d.Medal.length > 0 ? 1.0 : 0.0;
      //     })
      //     //  /
      //      // d3.sum(v, function(d) {
      //         // return the sum of the medals / the total number of athletes who participated that year
      //         // Tricky part: counting distinct athletes
      //       //   var num_athlete = 0.0;
      //       //   if (!athleteNames.contains(d.Name)) {
      //       //     num_athlete = 1.0;
      //       //     athleteNames.add(d.Name);
      //       //   }
      //       //   return num_athlete;
      //       // })
      //     })
  		.entries(data);
      console.log("ratio nesting", entriesBySportByYearByCountryRatio)

      // will need to put all this in a function that gets updated/called when the sport and year change
      currSport = "Swimming" // hard coded temporarily
      currYear = "2000" // hard coded temporarily
      yearsData = _.find(d3.values(entriesBySportByYearByCountryRatio), function (item) {
          console.log("searching for sport ", currSport);
          console.log("considering ", item.key);
          return item.key === currSport;
      });
      console.log(yearsData);
      countries = _.find(d3.values(yearsData.values), function (item) {
          console.log("searching for year ", currYear);
          console.log("considering ", item.key);
          return item.key === currYear;
      });
      console.log("countries", countries.values);
      var athleteNames = [];
      countries.values.forEach(function(d) {
        console.log("country:", d.values);
        var countryName = d.key;
        var athletes = d.values;
        console.log("country name:", countryName);
        console.log("athletes:", athletes);
        // TODO: Within this country: for each athlete row, count the number of
        //        distinct athletes as well as the number of medals won.
        //        Compute the medal:athlete ratio.
        //        Store back in a map of some sort: country -> medal:athlete ratio.
      })

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
