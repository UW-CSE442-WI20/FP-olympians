// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');
const _ = require("underscore");

const generateMedalChart = require("./medalChart");
const SummaryCountry = require('./summaryChartCountry');
var selectedCountry = undefined;
class bigChart {
  constructor(data) {

    // Formatting lines

    // getting width and height of graph
    this.width = 0;// = parseInt(bigsvg.style("width"), 10);
    this.height = 0;// = parseInt(bigsvg.style("height"), 10);
    this.margin = 50;
    // this.margins = { top: 30, right: 10, bottom: 10, left: 10 };
    this.margins = { top: 30, right: 35, bottom: 10, left: 35 };

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


    /* Add SVG */
    var svg = bigsvg
      .append("svg")
      .attr("width", this.width + this.margins.left + this.margins.right)
      .attr("height", this.height + this.margins.top + this.margins.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margins.top + "," + this.margins.top + ")"); // this is just (30, 30 right now)

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
    var xAxis = d3.axisBottom(xScale).ticks(5);
    // const xAxis = d3.axisBottom(xScale))
    //     .tickPadding(30)
    //     .tickValues(getTickValues(2000, 2020))
    //     .tickFormat(d3.format("Y"))
    var yAxis = d3.axisLeft(yScale).ticks(5);

    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", `translate(0, ${this.height - this.margin})`)
    //   .call(xAxis);

    var dimensions = []
    for (let i = 2000; i <= 2020; i += 4) {
      dimensions.push(i);
    }


    // x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    //   return d != "name" && (y[d] = d3.scale.linear()
    //       .domain(d3.extent(cars, function(p) { return +p[d]; }))
    //       .range([height, 0]));
    // }));

    console.log(dimensions);
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

    this.redraw(bigsvg, currSport, medalsvg);
  }

  redraw(bigsvg, currSport, medalsvg) {

    if (currSport.length === "") {
      return;
    }

    var duration = 250;
    var lineOpacity = "0.50";
    var lineOpacityHover = "0.95";
    var otherLinesOpacityHover = "0.25";
    var otherLinesOpacitySelected = "0.1"
    var lineStroke = "3px";
    var lineStrokeHover = "4.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;

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

    console.log(data);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");

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

    yAxis = d3.axisLeft(yScale);


    var line = d3.line()
      .x(d => xScale(d.key))
      .y(d => yScale(d.value));



    var lineGroup = this.lines.selectAll(".line-group")
      .data(data, function (item) {
        return item;
      })


    var country = this.summaryCountry

    lineGroup
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', d => 'line')
      .attr('d', d => line(d.values))
      // Draw color based on index? Or maybe based on country?
      .style('stroke', d => color(d.key))
      .style('opacity', lineOpacity)
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
          svg.append("text")
            .text(d.key)
            .attr('class', 'country-text')
            .attr("x", (width - margin) / 2)
            .attr("y", 15)
            .style('fill', color(d.key))
        }
        else if (selectedCountry === d) {
          d3.select(this)
            .style('stroke', 'black')
        }
      })
      .on("mouseout", function (d) {
        if (selectedCountry === undefined) {
          d3.selectAll(".line")
            .style("opacity", lineOpacity)
            .style("stroke-width", lineStroke)
          // d3.select(this)
          //   .style('opacity', lineOpacity)
          //   .style("stroke-width", lineStroke);
          svg.selectAll(".country-text").remove();
        }
        else if (selectedCountry === d) {
          d3.select(this)
            .style('stroke', d => color(d.key))
        }
      })
      .on("click", function (d) {
        // get the data for the selected athlete
        selectedCountry = selectedCountry === undefined ? d : undefined;
        if (selectedCountry === d) {
          d3.selectAll(".line")
            .style('opacity', otherLinesOpacitySelected)
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style('stroke-width', lineStrokeHover);
        } else {
          d3.selectAll(".line")
            .style("opacity", lineOpacity)
            .style("stroke-width", lineStroke)
          return;
        }
        console.log(entriesBySportThenCountryThenYear)
        console.log(d);
        console.log("curr sport:", currSport);
        var sportData = _.find(d3.values(entriesBySportThenCountryThenYear), function (item) {
          console.log("searching for ", currSport);
          // console.log("considering ", item.key);
          return item.key === currSport;
        });
        console.log(sportData);
        var countryData = _.find(d3.values(sportData.values), function (item) {
          console.log("searching for ", d.key);
          // console.log("considering ", item.key);
          return item.key === d.key;
        });
        country.updateChart(countryData.key);
        console.log("checking countryData", countryData);
        generateMedalChart(countryData.values, medalsvg);
      });

    lineGroup.exit()
      .transition()
      .style('opacity', 0)
      .remove();

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
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -10)
      .text(function (d) { return d; })
      .style("fill", "black")

    svg.selectAll(".parallelAxis")
      .transition().duration(1500)
      .each(function (d) {
        d3.select(this).call(yAxis)
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


// function brushstart() {
//   // d3.event.
// }

// function brush() {
//   var brushRange = this.brushRange;
//   var actives = dimensions.filter(function(p) { return !brushRange[p].empty()})
//   console.log(actives);
// }

module.exports = bigChart;
