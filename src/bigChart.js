// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');
const _ = require("underscore");

const generateMedalChart = require("./medalChart");

class bigChart {
  constructor() {

    // Formatting lines

    // getting width and height of graph
    this.width = 0;// = parseInt(bigsvg.style("width"), 10);
    this.height = 0;// = parseInt(bigsvg.style("height"), 10);
    this.margin = 50;
    // this.margins = { top: 30, right: 10, bottom: 10, left: 10 };
    this.margins = { top: 30, right: 35, bottom: 10, left: 35 };

    // getting scale of graph

    // getting color sceme
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    // getting lineScale
    this.line;
    // getting the area where lines are added
    this.lines;


    // the svg containing the whole chart
    this.svg;

    // Additional data required for medalChart
    this.entriesBySportThenCountryThenYear;
  }

  drawChart(bigsvg, data, currSport, medalsvg, entriesBySportThenCountryThenYear) {
    // var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    // Set the width and height of the graph
    // var margin = { top: 30, right: 10, bottom: 10, left: 10 }
    this.width = parseInt(bigsvg.style("width"), 10);
    this.height = parseInt(bigsvg.style("height"), 10);

    this.width = this.width - this.margins.left - this.margins.right;
    this.height = this.height - this.margins.top - this.margins.bottom;

    this.entriesBySportThenCountryThenYear = entriesBySportThenCountryThenYear;

    console.log("+++++++++++++++++++++++++");
    console.log(data);
    console.log("+++++++++++++++++++++++++");

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


    // delete all lines


    /* Add SVG */
    var svg = bigsvg
      .append("svg")
      .attr("width", this.width + this.margins.left + this.margins.right)
      .attr("height", this.height + this.margins.top + this.margins.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margins.top + "," + this.margins.top + ")"); // this is just (30, 30 right now)

    /* Add line into SVG */
    this.line = d3.line()
      .x(d => xScale(d.key))
      .y(d => yScale(d.value));

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

    svg.selectAll(".parallelAxis")
      .data(dimensions).enter()
      .append("g")
      .attr('class', 'parallelAxis')
      .attr("transform", function (d) {
        console.log(xScale(d));
        return "translate(" + xScale(d) + ") ";
      })
      // And I build the axis with the call function
      .each(function (d) {
        d3.select(this).call(yAxis);
      })
      // Add axis title
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -10)
      .text(function (d) { return d; })
      .style("fill", "black");


    svg.selectAll(".axisBrush")
      .data(dimensions).enter()
      .append("g")
      .attr('class', 'axisBrush')
      .each(function (d) {
        // console.log("xxxxxxxxxxxxxxxxx")
        // console.log(d);
        // xScale(d), 0], [xScale(d) + 5, this.height
        // d3.brushY().extent([0, 0], [100, 200])
        d3.select(this).call(d3.brushY().extent([[xScale(d) - 8, 0], [xScale(d) + 8, yScale(80)]])) //TODO: change 600 to be this.height
      })

    this.redraw(bigsvg, data, currSport, medalsvg);
  }

  brushstart() {
    d3.event.sourceEvent.stopPropogation();
  }

  brush() {

  }

  redraw(bigsvg, data, currSport, medalsvg) {


    console.log(data);

    var duration = 250;
    var lineOpacity = "0.50";
    var lineOpacityHover = "0.95";
    var otherLinesOpacityHover = "0.1";
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
    var svg = bigsvg;
    console.log("+++++++++++++++++++++++++");
    console.log("finding currSport: ", currSport)
    var data = _.find(d3.values(data), function (item) {
      return item.key == currSport;
    }).values;

    console.log(data);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");

    var entriesBySportThenCountryThenYear = this.entriesBySportThenCountryThenYear;
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


    var lineGroup = this.lines.selectAll(".line-group")
      .data(data, function (item) {
        return item;
      })


    lineGroup
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', d => 'line ' + d.key)
      .attr('d', d => this.line(d.values))
      // Draw color based on index? Or maybe based on country?
      .style('stroke', d => color(d.key))
      .style('opacity', lineOpacity)
      .style('fill', 'none')
      .on("mouseover", function (d) {
        // change line opacity
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
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .style('opacity', lineOpacity)
          .style("stroke-width", lineStroke);
        svg.selectAll(".country-text").remove();
      })
      .on("click", function (d) {
        // get the data for the selected athlete
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
        console.log(countryData);
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
        .text("Medals Won");
  }

}

module.exports = bigChart;
