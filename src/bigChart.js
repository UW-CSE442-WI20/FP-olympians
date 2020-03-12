// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');
const _ = require("underscore");

const generateMedalChart = require("./medalChart");
const SummaryCountry = require('./summaryChartCountry');


var selectedCountry = undefined;

var bigChartInstance = null;

var duration = 250;
var lineOpacity = "0.5";
var lineOpacityHover = "0.95";
var otherLinesOpacityHover = "0.1";
var otherLinesOpacitySelected = "0.025"
var lineStroke = "3px";
var lineStrokeHover = "4.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;

// Create container for the tooltip but make it invisible until we need it
const tooltipContainer = d3.select('#bigchart').append("div")
    .attr("id", "countryTooltip")
    .style("position", "absolute")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("visibility", "hidden")
tooltipContainer.append("div")
    .attr("id", "countryTooltipTextDiv")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center")
tooltipContainer.append("div")
    .attr("id", "countryTooltipFlagDiv")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");



class bigChart {
  constructor(data) {


    bigChartInstance = this;
    // Formatting lines
    bigChartInstance = this;

    // getting width and height of graph
    this.width = 0;// = parseInt(bigsvg.style("width"), 10);
    this.height = 0;// = parseInt(bigsvg.style("height"), 10);
    this.margin = 50;
    // this.margins = { top: 30, right: 10, bottom: 10, left: 10 };
    this.margins = { top: 30, right: 35, bottom: 0, left: 35 };

    // getting scale of graph

    // adding tiny chart
    this.columnNames = ["Year", "Athletes", "Medals"];
    this.summaryCountry = new SummaryCountry(data, this.columnNames);

    // getting color sceme
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    // getting lineScale
    this.line;
    // getting the area where lines are added
    this.lines;

    // Figures out the maximum amount of athletes for a sport for each year
    this.yRange = {}
    this.brushRange = {}
    this.dimensions;
    this.currSport;

    // the svg containing the whole chart
    this.svg;

    // Additional data required for medalChart
    this.entriesBySportThenCountryThenYear;

    this.entriesBySportByYearAthleteCount = d3.nest()
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
    this.entriesBySportByYearAthleteCount.forEach(function(d) {
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
  }

  drawChart(bigsvg, currSport, medalsvg, entriesBySportThenCountryThenYear) {
    // var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    // Set the width and height of the graph
    // var margin = { top: 30, right: 10, bottom: 10, left: 10 }
    this.width = parseInt(bigsvg.style("width"), 10);
    this.height = parseInt(bigsvg.style("height"), 10);

    this.width = this.width - this.margins.left - this.margins.right;
    this.height = this.height - this.margins.top - this.margins.bottom;

    this.entriesBySportThenCountryThenYear = entriesBySportThenCountryThenYear;

    this.summaryCountry.createChart('Afghanistan');

    const minYear = 2000;
    const maxYear = 2020;

    // from medalchart
    const getXDomain = () => {
      var domain = [];
      for (let i = minYear; i <= maxYear; i += 4) {
        domain.push(i);
      }
      return domain;
    }

    /* Scale */
    var xScale = d3.scaleLinear().domain([2000, 2020]).range([this.margins.left, this.width - this.margins.left - this.margins.right]);
    // var xScale = d3.scaleLinear()
    //   .domain([2000, 2020]) // getXDomain()
    //   .range([this.margins.left, this.width - this.margins.left - this.margins.right - 30]); // used to start at 0

    console.log("big chart x scale lower range:", this.margins.left);
    console.log("big chart x scale upper range:", this.width - this.margins.left - this.margins.right - 30);

    var yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([this.height - this.margins.top - this.margins.bottom, 0]);


    this.xScale = xScale;
    this.yScale = yScale;
    // delete all lines

	var dimensions = []
    for (let i = 2000; i <= 2020; i += 4) {
      dimensions.push(i);
    }

	var yearlabelsvg = d3.select("#bigchartlabels")
      	.attr("transform", "translate(" + this.margins.top + "," + this.margins.top + ")");
    yearlabelsvg.selectAll(".yearLogoLabel")
      	.data(dimensions).enter()
        .append("div")
        .attr('class', 'yearLogoLabel')
        .attr("transform", function (d) {
        	console.log("supposedly getting year", d);
          return "translate(" + xScale(d) + ") ";
        });
    yearlabelsvg.selectAll(".yearLogoLabel")
      	.append("text")
        .attr("class", "yearLabel")
        .style("text-anchor", "middle")
        .text(function (d) { return d; })
        .style("fill", "gray");
    yearlabelsvg.selectAll(".yearLogoLabel")
    	  .append("img")
        .attr("src", (d) => { 
        	console.log("src", d); 
        	return "olympic_logos/" + d + ".svg"; 
        })
        .attr("class", "yearLogo")
        // .attr("width", "90px");
        .attr("height", "60px");

    /* Add SVG */
    var svg = bigsvg
      .append("svg")
      .attr("width", this.width + this.margins.left + this.margins.right)
      .attr("height", this.height + this.margins.top + this.margins.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margins.top + "," + (this.margins.top * 2) + ")"); // this is just (30, 30 right now)

    // /* Add line into SVG */
    // this.line = d3.line()
    //   .x(d => xScale(d.key))
    //   .y(d => yScale(d.value));

    this.lines = svg.append('g')
      .attr('class', 'lines');


    // from medalchart
    const getTickValues = (startTick, endTick) => {
      var values = [];
      for (var i = startTick; i <= endTick; i += 4) {
        values.push(i)
      }
      return values;
    }

    /* Add Axis into SVG */
    //var xAxis = d3.axisBottom(xScale).ticks(5);
    // const xAxis = d3.axisBottom(xScale))
    //     .tickPadding(30)
    //     .tickValues(getTickValues(2000, 2020))
    //     .tickFormat(d3.format("Y"))
    //var yAxis; // = d3.axisLeft(yScale).ticks(5);

    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", `translate(0, ${this.height - this.margin})`)
    //   .call(xAxis);

    // x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    //   return d != "name" && (y[d] = d3.scale.linear()
    //       .domain(d3.extent(cars, function(p) { return +p[d]; }))
    //       .range([height, 0]));
    // }));

    console.log(this.entriesBySportByYearAthleteCount);
    var yRange = this.yRange;
    this.entriesBySportByYearAthleteCount.forEach(function (sport) {
      if (sport.key.length == 0) {
        return;
      }
      var maxVal = undefined
      sport.values.forEach(function (country) {
        country.values.forEach(function (year) {
          var yearInt = parseInt(year.key, 10);
          if (maxVal == undefined) {
            maxVal = year.value;
          }
          else if (maxVal < year.value) {
            maxVal = year.value;
          }
        })
      })
      console.log(sport.key + ": " + maxVal);
      yRange[sport.key] = maxVal;
      // d3.scaleLinear()
      //   .domain([0, maxVal])
      //   .range([height, 0]);
    })

    this.dimensions = dimensions;
    this.yRange = yRange;
    this.svg = svg;
    console.log(this.yRange);

    var actualHeight = this.height - this.margins.top - this.margins.bottom;

    var yScale = d3.scaleLinear()
      .domain([0, yRange[currSport]])
      .range([actualHeight, 0]);

    // set up y axis
    var yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d"))
      .ticks(7)
      .tickSize(0)
      .tickPadding(-5);

    // now add titles to the axes
    bigsvg.append("text")
      .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate(" + this.margins.left + "," + (this.height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
      .text("Athletes Participated");
    svg.selectAll(".parallelAxis")
        .data(dimensions).enter()
        .append("g")
        .attr('class', 'parallelAxis')
        .attr("transform", function (d) {
          return "translate(" + xScale(d) + ") ";
     	});
    svg.selectAll(".parallelAxis")
        .each(function (d) {
          // add in the rectangle bars
          d3.select(this).append("rect")
            .attr("x", -6)
            .attr("y", -6)
            .attr("width", 14)
            .attr("height", 335)
            .attr("fill", "#525B68")
            .attr("opacity", 0.8);
          //d3.select(this).call(yAxis);
          d3.select(this).transition().duration(500).call(yAxis);
    	});

    this.redraw(bigsvg, currSport, medalsvg);
  }

  redraw(bigsvg, currSport, medalsvg) {

    if (currSport.length === "") {
      return;
    }

    // var duration = 250;
    // var lineOpacity = "0.5";
    // var lineOpacityHover = "0.95";
    // var otherLinesOpacityHover = "0.1";
    // var otherLinesOpacitySelected = "0.025"
    // var lineStroke = "3px";
    // var lineStrokeHover = "4.5px";

    // var circleOpacity = '0.85';
    // var circleOpacityOnLineHover = "0.25"
    // var circleRadius = 3;
    // var circleRadiusHover = 6;

    var width = this.width;
    var margin = this.margin;
    // let lines = d3.select('.lines');

    var color = this.color;
    var svg = this.svg
    console.log("+++++++++++++++++++++++++");
    console.log("finding currSport: ", currSport)
    var entriesBySportByYearAthleteCount = this.entriesBySportByYearAthleteCount;
    var entriesBySportThenCountryThenYear = this.entriesBySportThenCountryThenYear;
    console.log(currSport)
    var data = _.find(d3.values(entriesBySportByYearAthleteCount), function (item) {
      return item.key == currSport;
    }).values;

    var dimensions = this.dimensions;
    var yRange = this.yRange;
    this.currSport = currSport;

    console.log(svg);

    // this.lines.selectAll(".line-group")
    // .transition()
    // .style('opacity',0)
    // .remove();
    // var lineGroup = this.lines.selectAll('.line-group')
    // .data(data, function (item) {
    //   console.log(item)
    //   return item.key;
    // })


    /* Add line into SVG */

    var actualHeight = this.height - this.margins.top - this.margins.bottom;

    var xScale = this.xScale;
    console.log(yRange[currSport])
    console.log(this.height);
    console.log(actualHeight);
    var yScale = d3.scaleLinear()
      .domain([0, yRange[currSport]])
      .range([actualHeight, 0]);

    // set up y axis
    var yAxis = d3.axisLeft(yScale)
      // .tickFormat(d3.format("d"))
      .ticks(7)
      .tickSize(0)
      .tickPadding(-5)
      .tickFormat(function (e) {
        if (Math.floor(e) != e) {
          return;
        }

        return e;
      });

    var line = d3.line()
      .x(d => xScale(d.key))
      .y(d => yScale(d.value));


    console.log(data);
    var lineGroup = this.lines.selectAll(".line-group")
      .data(data, function (item) {
        return item;
      })


    var country = this.summaryCountry

    // reset the selectedCountry as we have changed to a different one
    selectedCountry = undefined;

    svg.selectAll(".country-text").remove();

    lineGroup
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', 'line')
      .attr('id', d => d.key.replace(/\s+/g, ''))
      .attr('d', d => line(d.values))
      // Draw color based on index? Or maybe based on country?
      .style('stroke', d => color(d.key))
      .style('opacity', 0)
      .style('fill', 'none')
      .on("mouseover", function (d) {
        if (selectedCountry === undefined) {
          // change line opacity
          d3.selectAll(".line")
            .style('opacity', otherLinesOpacityHover)
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style('stroke-width', lineStrokeHover);
          // add text to show what country this is
          tooltipContainer
              .style("left", (d3.mouse(this)[0]) + "px")
              .style("top", (d3.mouse(this)[1]) + "px")
              .style("visibility", "visible")
              .style('color', color(d.key));
          d3.select("#countryTooltipTextDiv")
              .append("text")
              .attr("class", "countryTooltipText")
              .style('color', color(d.key))
              .text(d.key)
          d3.select("#countryTooltipFlagDiv")
              .append("img")
              .attr("class", "countryTooltipFlag")
              .attr("src", () => {
                var imgName = (d.key).replace(/ /g,"-").replace("\'","-").toLowerCase();
                return "flags/" + imgName + "-flag.svg";
              })
              .attr("width", 60)
              .attr("height", 40);
        }
        else if (selectedCountry === d.key) {
          d3.select(this)
            .style('stroke', 'black')
        }
      })
      .on("mouseout", function (d) {
        d3.selectAll(".countryTooltipText").remove();
        d3.selectAll(".countryTooltipFlag").remove();
        d3.selectAll("#countryTooltip").style("visibility", "hidden");
        if (selectedCountry === undefined) {
          d3.selectAll(".line")
            .style("opacity", lineOpacity)
            .style("stroke-width", lineStroke)
          // d3.select(this)
          //   .style('opacity', lineOpacity)
          //   .style("stroke-width", lineStroke);
          svg.selectAll(".country-text").remove();
        }
        else if (selectedCountry === d.key) {
          d3.select(this)
            .style('stroke', d => color(d.key))
        }
      })
      .on("click", function (d) {

        redrawBigChartClick(d.key, currSport, medalsvg, true)

      })
      .transition()
      .duration(1000)
      .style('opacity', lineOpacity)



    lineGroup.exit()
      .transition()
      .style('opacity', 0)
      .remove();

    svg.selectAll(".parallelAxis")
      .each(function (d) {
        d3.select(this).transition().duration(500).call(yAxis);
      })

    var brushRange = {};
    svg.selectAll(".axisBrush")
      .data(dimensions).enter()
      .append("g")
      .attr('class', 'axisBrush')
      .each(function (d) {
        // console.log("xxxxxxxxxxxxxxxxx")
        // console.log(d);
        // xScale(d), 0], [xScale(d) + 5, this.height
        // d3.brushY().extent([0, 0], [100, 200])


        // d3.select(this).call(brushRange[d] = d3.brushY().extent([[xScale(d) - 8, 0], [xScale(d) + 8, yScale(0)]]).on("brush", function () {
        //   console.log("yo");
        // }).on("brush", brush)) //TODO: change 600 to be this.height
      })
    this.brushRange = brushRange;
  }
}

function redrawBigChartClick(currCountry, currSport, medalsvg, bigChartClick) {
  // console.log(this);
  if (bigChartClick === true) { // if we are clicking, we want to figure out if its an on or off toggle
    selectedCountry = selectedCountry === undefined ? currCountry : undefined;
  } else {
    selectedCountry = currCountry;  // if its from another source
    d3.selectAll(".country-text").remove();
  }
  if (selectedCountry != undefined) { // when a sport is about to be unselectede
    d3.selectAll(".line")
      .transition()
      .duration(700)
      .style('opacity', otherLinesOpacitySelected)
    d3.select("#" + currCountry.replace(/\s+/g, '')) // based on https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
      .transition()
      .duration(700)
      .style('opacity', lineOpacityHover)
      .style('stroke-width', lineStrokeHover)
  } else {
    // When this is undefined or when something is deslected, reset all strokes
    d3.selectAll(".line")
      .transition()
      .duration(500)
      .style("opacity", lineOpacity)
      .style("stroke-width", lineStroke)
      .style('stroke', d => bigChartInstance.color(d.key));
    d3.selectAll(".country-text").remove();
    return;
  }
  console.log(bigChartInstance.entriesBySportThenCountryThenYear)
  // console.log(d);
  console.log("curr sport:", currSport);
  var sportData = _.find(d3.values(bigChartInstance.entriesBySportThenCountryThenYear), function (item) {
    console.log("searching for ", currSport);
    // console.log("considering ", item.key);
    return item.key === currSport;
  });
  console.log(sportData);
  var countryData = _.find(d3.values(sportData.values), function (item) {
    console.log("searching for ", currCountry);
    // console.log("considering ", item.key);
    return item.key === currCountry;
  });
  var country = this.summaryCountry
  bigChartInstance.summaryCountry.updateChart(countryData.key);
  console.log("checking countryData", countryData);
  generateMedalChart(countryData.values, medalsvg);
}

module.exports = { bigChart, redrawBigChartClick };
