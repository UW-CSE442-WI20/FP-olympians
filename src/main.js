

// You can require libraries
const d3 = require('d3');
const _ = require("underscore");

// Global variables
var entriesBySport = null;
var entriesByCountryThenSport = null;
var entriesBySportThenCountryThenYear = null;
var entriesBySportByYearMedalCount = null;
var entriesBySportByYearAthleteCount = null;
var entriesBySportByYearByCountryRatio = null;
var currSport = "Archery";
var currYear = "2012";
var topCountryToRatio = null;  // top 10 results for ranking

// Include local JS files:
const BigChart = require('./bigChart');
const RankRows = require('./rankRows');
const bigChartInstance = new BigChart();


// create svg for smallChart (the entire rank rows area)
//const rankRowsDiv = d3.select('#smallchart');
// const bigChartDiv = d3.select('#bigchart');
// const medalChartDiv = d3.select('#medalchart');

const rankRowsDiv = d3.select('#rankings');
var rankRows = null;

// create all of the rank rows (10 is number of results to display)
// ** will want to add data as a parameter

//const rankRows = new RankRows(rankRowsDiv, 3);

function initializeRankChart() {
  rankRows = new RankRows(rankRowsDiv, topCountryToRatio);
}

// create svg for bigChart
const bigsvg = d3.select('#bigchart')
  .append('svg')
  .attr('width', "1000")
  .attr('height', 380);


// create svg for medalChart
const medalsvg = d3.select('#medalchart')
  .append('svg')
  .attr("width", "1000")
  .attr("height", 380);

// draw small chart elements here
var topRanks = [1, 2, 3];  // Basic Test Example
// draw the three top rank elements
//smallChartInstance.drawTopRanks(smallsvg, topRanks); --- SOMETHING WRONG HERE, SMALLCHARTINSTANCE IS NOT DECLARED?

// bigChartInstance.drawChart(bigsvg);


function initializeDropdowns() {
  var select = document.getElementById("select-sport");
  console.log(entriesBySport);
  for (var index in entriesBySport) {
    select.options[select.options.length] = new Option(entriesBySport[index].key, index);
  }
  // add event listener to find out when the sport changes
  select.addEventListener('change', function () {
    currSport = document.getElementById('select-sport');
    console.log("curr sport:", currSport);
    currSportSelections = document.getElementById('select-sport');
    currSport = entriesBySport[currSportSelections.value].key;
    console.log("HERE", entriesBySport);
    console.log(currSportSelections.value);
    console.log("currSport is ", currSport);
    console.log("currYear is ", currYear);
    //console.log("curr sport:", entriesBySportByYearMedalCount[currSport.value].key);
    updateRanking(currSport, currYear);
    rankRows.updateRankRows(rankRowsDiv, topCountryToRatio);
    bigChartInstance.redraw(bigsvg, currSport, medalsvg);

  })

  var currSportSelections = document.getElementById('select-sport');
  //console.log("currSport ", currSport);
  //bigChartInstance.redraw(bigsvg, entriesBySportByYearMedalCount[currSportSelections.value].values);
  // })

}

function initializeData(data) {
  data.forEach(function (d) {
    d.ID = +d.ID;
    d.Age = +d.Age;
    d.Year = +d.Year;
    d.Order = +d.Order;
  })

  entriesByCountryThenSport = d3.nest()
    .key(function (d) {
      return d.Team;
    })
    .key(function (d) {
      return d.Sport;
    })
    .entries(data);

  entriesByCountry = d3.nest()
    .key(function (d) {
      return d.Team;
    })
    .entries(data);

  // const myKeys = Object.keys(entriesByCountry) // returns [ 'keyA', 'keyB', 'keyC' ];
  //
  // myKeys.sort((a, b) => {
  //
  // // custom comparator, update this for your specific use case
  //
  // return entriesByCountry[b].values.length - entriesByCountry[a].values.length
  //
  // })
  //
  //
  // myKeys.forEach((k) =>{
  //
  // const value = entriesByCountry[k];
  // console.log("here are the countries", value)
  // })

  entriesBySport = d3.nest()
    .key(function (d) {
      return d.Sport;
    })
    .sortKeys(d3.ascending)
    .entries(data);

  console.log("figuring out medal count");
  entriesBySportByYearMedalCount = d3.nest()
    .key(function (d) {
      return d.Sport;
    })
    .sortKeys(d3.ascending)
    .key(function (d) {
      return d.Team;
    })
    .sortKeys(d3.ascending)
    .key(function (d) {
      return d.Year;
    })
    .sortKeys(d3.ascending)
    .rollup(function (v) {
      // console.log(v);
      return d3.sum(v, function (d) {
        // console.log(111111111)
        // console.log(d)
        return d.Medal.length > 0 ? 1 : 0
      })
    })
    .sortKeys(d3.ascending)
    .entries(data);


  console.log("finished: ", entriesBySportByYearMedalCount);
  entriesBySportThenCountryThenYear = d3.nest()
    .key(function (d) {
      return d.Sport;
    })
    .sortKeys(d3.ascending)
    .key(function (d) {
      return d.Team;
    })
    .sortKeys(d3.ascending)
    .key(function (d) {
      return d.Year;
    })
    .sortKeys(d3.ascending)
    .entries(data)




  entriesBySportByYearAthleteCount = d3.nest()
    .key(function (d) {
      return d.Sport;
    })
    .sortKeys(d3.ascending)
    .key(function (d) {
      return d.Team;
    })
    .sortKeys(d3.ascending)
    .key(function (d) {
      return d.Year;
    })
    .sortKeys(d3.ascending)
    .rollup(function (v) {
      let uniqueNames = _.uniq(v, function (item) {
        return item.Name;
      })
      return uniqueNames.length;
    })
    .entries(data);

  console.log(entriesBySportByYearAthleteCount);


  // DO THIS ONE

  entriesBySportByYearByCountryRatio = d3.nest()
    .key(function (d) {
      return d.Sport;
    })
    .key(function (d) {
      return d.Year;
    })
    .key(function (d) {
      return d.Team;
    })
    .sortKeys(d3.ascending)
    .entries(data);
  console.log("ratio nesting", entriesBySportByYearByCountryRatio);

  // const countByYearByCountry = _.countBy(yearByCountry, function(item) {
  // 	console.log(item);
  // 	return item.Team;
  // })

  // console.log("**********************")
  // console.log(countByYearByCountry);
  // console.log("**********************")
}

function updateRanking(currSport, currYear) {
  // will need to put all this in a function that gets updated/called when the sport and year change
  // currSport = "Swimming"; // hard coded temporarily
  // currYear = "2000"; // hard coded temporarily
  // get all the data for a given sport (currSport) across the years
  yearsData = _.find(d3.values(entriesBySportByYearByCountryRatio), function (item) {
    // console.log("searching for sport ", currSport);
    // console.log("considering ", item.key);
    return item.key === currSport;
  });
  console.log("yearsData", yearsData);
  // get all the data for all the countries across a given year (currYear)
  countries = _.find(d3.values(yearsData.values), function (item) {
    // console.log("searching for year ", currYear);
    // console.log("considering ", item.key);
    return item.key === currYear;
  });
  // console.log("countries", countries.values);

  // mapping for the flag tile ranking
  var athleteNames = [];
  var countryToRatio = [];
  // Within each country: for each athlete row, count the number of
  // distinct athletes as well as the number of medals won.
  // Compute the medal:athlete ratio.
  // Store back in a list of key:value objects: country -> medal:athlete ratio.
  console.log("countries", countries);
  if (countries == null) {
    // no competition of this sport in currYear (ex. baseball dropped in 2012 and 2016)
    console.log("No " + currSport + " in " + currYear);
    document.getElementById("ranking-info").innerHTML = "No " + currSport + " in " + currYear + "!!";
  } else {

    countries.values.forEach(function (d) {
      // console.log("country:", d.values);
      var countryName = d.key;
      var athletes = d.values;
      // console.log("country name:", countryName);
      // console.log("athletes:", athletes);
      var num_medals = 0.0;
      var num_athletes = 0.0;
      athletes.forEach(function (a) {
        if (!athleteNames.includes(a.Name)) {
          athleteNames.push(a.Name);
          num_athletes++;
        }
        if (a.Medal.length > 0) {
          num_medals++;
        }
      })
      // console.log("num_medals:", num_medals);
      // console.log("num_athletes:", num_athletes);
      var ratio = num_athletes === 0 ? 0 : num_medals / num_athletes;
      // console.log("ratio:", ratio);
      countryToRatio.push(new Object({ key: countryName, value: ratio }));
    })
    countryToRatio.sort((a, b) => (a.value > b.value) ? -1 : 1);
    // console.log("country to ratio mapping:", countryToRatio);
    topCountryToRatio = countryToRatio.slice(0, 10);
    // console.log("top ten country to ratio mappings:", topCountryToRatio);


    // not sure the best place to update this: the Rankings Header
    document.getElementById("ranking-info").innerHTML = currSport + " " + currYear + " Rankings";
  }
}

// Function that returns sorted order of countries based on medals for that sport in 2016
function createRanking(sport) {

  // var currSportOnly = entriesBySportByYearMedalCount[0].values;
  // console.log("curr sport only:", currSportOnly)

  console.log("**********************")
  // console.log(currSportOnly);
  console.log("in createRatings", entriesBySportThenCountryThenYear)
  console.log("**********************")
  console.log("passing into bigchart DrawChart");
  bigChartInstance.drawChart(bigsvg, entriesBySportByYearAthleteCount, currSport, medalsvg, entriesBySportThenCountryThenYear);

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
    // createRanking("Swimming");
    updateRanking(currSport, currYear);
    initializeRankChart();
    initializeDropdowns();
    bigChartInstance.drawChart(bigsvg, entriesBySportByYearAthleteCount, currSport, medalsvg, entriesBySportThenCountryThenYear);
    //createRanking("Archery");
  });

  // You can load JSON files directly via require.
  // Note this does not add a network request, it adds
  // the data directly to your JavaScript bundle.
  // const exampleData = require('./example-data.json');
