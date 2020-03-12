const d3 = require('d3');
const _ = require("underscore");

// Global variables
var entriesBySport = null;
var entriesByCountryThenSport = null;
var entriesBySportThenCountryThenYear = null;
var entriesBySportByYearMedalCount = null;
var entriesBySportByYearAthleteCount = null;
var entriesBySportByYearByCountryRatio = null;
var entriesByCountry = null;
var countryNames = null;
var currSport = "Swimming";
var currYearIndex = 4; // 2016
var topCountryToRatio = null;  // top 10 results for ranking
var yearOptions = ["2000", "2004", "2008", "2012", "2016"];

// Include local JS files:
const autocomplete = require("./search");
const BigChart = require('./bigChart');
const RankRows = require('./rankRows');
const Map = require('./map');
var bigChartInstance;
var map;


const rankRowsDiv = d3.select('#rankings');
var rankRows = null;

// instantiate rankRows
function initializeRankChart() {
  rankRows = new RankRows(rankRowsDiv, topCountryToRatio);
}

// create svg for bigChart
d3.select("#bigchart").append("div")
	.attr("id", "bigchartlabels");
const bigsvg = d3.select('#bigchart')
  .append('svg')
  .attr('width', "800")
  .attr('height',"400");
console.log("bigsvg", bigsvg);

// create svg for medalChart
let medalsvg = d3.select('#medalchart')
		.append('svg')
		.attr("width", "800")
		.attr("height", 380);

// draw small chart elements here
var topRanks = [1, 2, 3];  // Basic Test Example
// draw the three top rank elements
//smallChartInstance.drawTopRanks(smallsvg, topRanks); --- SOMETHING WRONG HERE, SMALLCHARTINSTANCE IS NOT DECLARED?

// Set up year buttons
function initializeYearOptions() {
  var leftYear = document.getElementById("left-year");
  var rightYear = document.getElementById("right-year");
  leftYear.onclick = function() { updateCurrYear("left")};
  rightYear.onclick = function() { updateCurrYear("right")};
  // initialize year label
  document.getElementById("year-window").innerHTML = yearOptions[currYearIndex];
  // add in question mark
  d3.select("#question-mark").append("img")
    .attr("src","icon-question-mark.png")
    .attr("id", "question-icon")
    .attr("width", 20)
    .attr("height", 20);
}

// Set up sport dropdown
function initializeDropdowns() {
	var select = document.getElementById("select-sport");
  select.options = [];
  for (var index in entriesBySport) {
    if (entriesBySport[index].key != "") {
  	   select.options[select.options.length] = new Option(entriesBySport[index].key, index);
    }
	}
  // default selection
  select.options[25].selected = true;
	// add event listener to find out when the sport changes
	select.addEventListener('change', function() {
	   currSportSelections = document.getElementById('select-sport');
     currSport = entriesBySport[currSportSelections.value].key;
     console.log("HERE", entriesBySport);
     console.log(currSportSelections.value);
     console.log("currSport is ", currSport);
     console.log("currYear is ", currYearIndex);
     // update ranking based on sport selection
     var exist = updateRanking(currSport, currYearIndex);
     if (exist) {
       rankRows.updateRankRowsSport(rankRowsDiv, topCountryToRatio);
     } else {
       // no sport this year
       rankRows.clear();
     }
     // update big chart
     medalsvg.remove();
     medalsvg = d3.select('#medalchart')
		.append('svg')
		.attr("width", "800")
		.attr("height", 380);
     bigChartInstance.redraw(bigsvg,  currSport, medalsvg);
     initializeSearch();
  })
}

function initializeSearch() {
	var sportData = _.find(d3.values(entriesBySportThenCountryThenYear), function (item) {
	    // console.log("searching for ", currSport);
	    // console.log("considering ", item.key);
	    return item.key === currSport;
	});
	console.log("sport data", sportData);
	countryNames = [];
	var countries = sportData.values.forEach((item) => {
		countryNames.push(item.key);
	});
	console.log("countries", countryNames);
	autocomplete(document.getElementById("searchbar"), countryNames, sportData, medalsvg);
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
		.key(function(d) {
			return d.Sport;
		})
		.sortKeys(d3.ascending)
		.entries(data);

  //console.log("figuring out medal count");
	entriesBySportByYearMedalCount = d3.nest()
		.key(function(d) {
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
    .rollup(function(v) {
      return d3.sum(v, function(d) {
      return d.Medal.length > 0 ? 1 : 0})})
    .sortKeys(d3.ascending)
    .entries(data);



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
  	.entries(data);
    //console.log("ratio nesting", entriesBySportByYearByCountryRatio);


}

function updateCurrYear(direction) {
  // update currYearIndex if possible
  if (direction === "left" && currYearIndex > 0) {
    currYearIndex -= 1;
  } else if (direction === "right" && currYearIndex < yearOptions.length - 1) {
    currYearIndex += 1;
  }
  // update label
  document.getElementById("year-window").innerHTML = yearOptions[currYearIndex];
  // update ranks displayed
  var exist = updateRanking(currSport, currYearIndex);
  if (exist) {
    rankRows.updateRankRowsYear(rankRowsDiv, topCountryToRatio);
  } else {
    // no sport this year
    rankRows.clear();
  }
}

// Update the current top 10 country rankings
function updateRanking(currSport, currYearIndex) {
  // get all the data for a given sport (currSport) across the years
  yearsData = _.find(d3.values(entriesBySportByYearByCountryRatio), function (item) {
      return item.key === currSport;
  });
  console.log("yearsData", yearsData);
  // get all the data for all the countries across a given year (currYear)
  countries = _.find(d3.values(yearsData.values), function (item) {
      return item.key === yearOptions[currYearIndex];
  });

  // mapping for the flag tile ranking
  var athleteNames = [];
  var countryToRatio = [];
  // Within each country: for each athlete row, count the number of
  // distinct athletes as well as the number of medals won.
  // Compute the medal:athlete ratio.
  // Store back in a list of key:value objects: country -> medal:athlete ratio.
  if (countries == null) {
    // no competition of this sport in currYear (ex. baseball dropped in 2012 and 2016)
    console.log("No " + currSport + " in " + yearOptions[currYearIndex]);
    document.getElementById("ranking-info").innerHTML = "No " + currSport;
    return false;
  } else {

    countries.values.forEach(function(d) {
    // console.log("country:", d.values);
    var countryName = d.key;
    var athletes = d.values;
    // console.log("country name:", countryName);
    // console.log("athletes:", athletes);
    var num_medals = 0.0;
    var num_athletes = 0.0;
    athletes.forEach(function(a) {
      if (!athleteNames.includes(a.Name)) {
        athleteNames.push(a.Name);
        num_athletes++;
      }
      if (a.Medal.length > 0) {
        num_medals++;
      }
    })
    var ratio = num_athletes === 0 ? 0 : num_medals / num_athletes;
    countryToRatio.push(new Object({key: countryName, value: ratio}));
  })
  countryToRatio.sort((a, b) => (a.value > b.value) ? -1 : 1);
  topCountryToRatio = countryToRatio.slice(0, 10);

  // update the Rankings Header
  document.getElementById("ranking-info").innerHTML = currSport + " Rankings";
  return true;
  }
}

// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('olympics.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
    initializeData(data);
	// createRanking("Swimming");
    updateRanking(currSport, currYearIndex);
    initializeRankChart();
    initializeYearOptions();
    initializeDropdowns();
    initializeSearch();

    bigChartInstance = new BigChart(data);
    bigChartInstance.drawChart(bigsvg, currSport, medalsvg, entriesBySportThenCountryThenYear);

    d3.csv('rankings.csv')
      .then((data) => {
        map = new Map(entriesBySportByYearByCountryRatio, data);
        console.log("here are the rankings:", data)
      });
  });

  // You can load JSON files directly via require.
  // Note this does not add a network request, it adds
  // the data directly to your JavaScript bundle.
  // const exampleData = require('./example-data.json');
