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
var countryNamesBySport = null;
var countryNames = null;
var currSport = "Swimming";
var currYearIndex = 4; // 2016
var topCountryToRatio = null;  // top 10 results for ranking
var yearOptions = ["2000", "2004", "2008", "2012", "2016"];

// Include local JS files:
const autocomplete = require("./search");
const {bigChart} = require('./bigChart');
const RankRows = require('./rankRows');
const Map = require('./map');
var bigChartInstance;
var map;


const rankRowsDiv = d3.select('#rankings');
var rankRows = null;

// instantiate rankRows
function initializePage() {
  rankRows = new RankRows(rankRowsDiv, topCountryToRatio);

  // add in olympic rings here oops
  d3.select("#header-logo").append("img")
    .attr("src", "olympic_logos/olympic_rings.svg")
    .attr("width", 100)
    .attr("height", 100);

  // add in explanation text here
  document.getElementById("explore-countries").innerHTML =
    "Click on a country's line to see its medals. Click on any line to deselect.";
  document.getElementById("explore-medals").innerHTML =
    "Click on an athlete's medal to see all of the medals they've won. Click again to deselect.";

  // no country flag shown on start up
  d3.select("#country-selected").style("display", "none");
}

// create svg for bigChart
d3.select("#bigchart").append("div")
	.attr("id", "bigchartlabels");
const bigsvg = d3.select('#bigchart')
  .append('svg')
  .attr('width', "800")
  .attr('height',"440");

// create svg for medalChart
let medalsvg = d3.select('#medalchart')
		.append('svg')
		.attr("width", "800")
		.attr("height", 380);

// draw small chart elements here
var topRanks = [1, 2, 3];  // Basic Test Example
// draw the three top rank elements
//smallChartInstance.drawTopRanks(s

function updateSportIcon() {
  // remove old image
  d3.select("#sports-logo").remove();
  // get image name
  var sportName = currSport.replace(/ /g,"-").toLowerCase();
  if (sportName === "softball") {
    sportName = "baseball";
  }
  // add new image
  d3.select("#sport-text").append("img")
    .attr("src", "sports_logos/" + sportName + ".png")
    .attr("id", "sports-logo")
    .attr("width", 200)
    .attr("height", 200);
}

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
     bigChartInstance.redraw(bigsvg, currSport, medalsvg);
     initializeSearch();
     updateSportIcon();
     // remove country flag
     d3.select("#country-selected").style("display", "none");
  })
}

function initializeSearch() {
	var sportData = _.find(d3.values(entriesBySportThenCountryThenYear), function (item) {
	    return item.key === currSport;
	});
	countryNames = [];
	var countries = sportData.values.forEach((item) => {
		countryNames.push(item.key);
	});
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

	entriesBySportByYearMedalCount = d3.nest()
		.key(function(d) {
			return d.Sport;
    })
    .sortKeys(d3.ascending)
    .entries(data);

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


    countryNamesBySport = d3.nest()
    .key(function (d) {
      return d.Sport;
    })
    .sortKeys(d3.ascending)
    .rollup(function(v) {
      let uniqueCountries = _.uniq(v, function(d) {
        return d.Team;
      })
      return uniqueCountries.map(function(item) {
        return item.Team;
      }).sort();
    })
    .entries(data);


    console.log("YOOOOOOOOOOOOOOOOOOOOOOOOO");
    console.log(countryNamesBySport);
    console.log("YOOOOOOOOOOOOOOOOOOOOOOOOO")



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

  var years = ["2000", "2004", "2008", "2012", "2016"]
  entriesBySportByYearAthleteCount.forEach(function(d) {
    d.values.forEach(function(e) {
      var arr = []
      e.values.forEach(function(f) {
        arr.push(f.key);
      });
      result = years.filter(f => !arr.includes(f));
      result.forEach(function(z) {
        e.values.push({"key": z, "value": 0});
      });
      e.values.sort((a, b) => a.key - b.key)
    })
  });

 // testing
  // var years = ["2000", "2004", "2008", "2012", "2016"]
  // entriesBySportByYearAthleteCount.forEach(function(d) {
  //   d.values.forEach(function(e) {
  //     var arr = []
  //     e.values.forEach(function(f) {
  //       arr.push(f.key);
  //     });
  //     result = years.filter(f => !arr.includes(f));
  //     console.log("result", result)
  //   })
  // });

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
    document.getElementById("ranking-info").innerHTML = "No " + currSport;
    return false;
  } else {

    countries.values.forEach(function(d) {
    var countryName = d.key;
    var athletes = d.values;
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
    initializeData(data);
	// createRanking("Swimming");
    updateRanking(currSport, currYearIndex);
    initializePage();
    initializeYearOptions();
    initializeDropdowns();
    updateSportIcon();
    initializeSearch();
    // Clears the search
    document.getElementById("searchbar").value = "";

    bigChartInstance = new bigChart(data);
    bigChartInstance.drawChart(bigsvg, currSport, medalsvg, entriesBySportThenCountryThenYear);

    d3.csv('rankings.csv')
      .then((data) => {
        map = new Map(entriesBySportByYearByCountryRatio, data, currSport, medalsvg);
      });
  });

  // You can load JSON files directly via require.
  // Note this does not add a network request, it adds
  // the data directly to your JavaScript bundle.
  // const exampleData = require('./example-data.json');
