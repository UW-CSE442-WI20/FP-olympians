// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');
const _ = require("underscore");

const generateMedalChart = require("./medalChart");

class bigChart {
  constructor() {


    // Formatting lines


    // getting width and height of graph
    this.width;
    this.height;
    this.margin = 50;

    // getting scale of graph
    this.xScale;
    this.yScale;

    // getting color sceme
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    // getting lineScale
    this.line;
    // getting the area where lines are added
    this.lines;


    // the svg containing the whole chart
    this.svg;
  }


  drawChart(bigsvg, data, currSport, medalsvg) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    // Set the width and height of the graph
    this.width = parseInt(bigsvg.style("width"), 10);
    this.height = parseInt(bigsvg.style("height"), 10);
    // this.width = this.width - margin.left - margin.right;
    // this.height = this.height - margin.top - margin.bottom;



    console.log("+++++++++++++++++++++++++");
    console.log(data);
    console.log("+++++++++++++++++++++++++");
    // var width = 500;
    // var height = 300;



    // /* Format Data */
    // var parseDate = d3.timeParse("%Y");
    // data.forEach(function(d) {
    //   d.values.forEach(function(d) {
    //     d.date = parseDate(d.date);
    //     d.price = +d.price;
    //   });
    // });


    /* Scale */
    this.xScale = d3.scaleTime()
      .domain([1980, 2016])
      .range([0, this.width - this.margin]);

    this.yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([this.height - this.margin, 0]);


    // delete all lines


    /* Add SVG */
    svg = bigsvg

    bigsvg.attr("transform",  `translate(${this.margin / 2}, ${this.margin / 2})`)

    /* Add line into SVG */
    this.line = d3.line()
      .x(d => this.xScale(d.key))
      .y(d => this.yScale(d.value));

    this.lines = svg.append('g')
      .attr('class', 'lines');

    lines.selectAll("line")
    .transition()
    .style('opacity',0)
    .remove();

    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      // Draw color based on index? Or maybe based on country?
      .style('stroke', (d, i) => color(d.key))
      .style('opacity', lineOpacity)
      .style('fill', 'none')
      .on("mouseover", function(d) {
        // change line opacity
        d3.select(this)
        .style('opacity', lineOpacityHover)
        .style('stroke-width', lineStrokeHover);
        // add text to show what country this is
        svg.append("text")
        .text(d.key)
        .attr('class', 'country-text')
        .style('fill', color(d.key))
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .style('opacity', lineOpacity)
        .style("stroke-width", lineStroke);
        svg.select(".country-text").remove();
      })
        .on("click", function(d) {
          // get the data for the selected athlete
          console.log(d);
          console.log("curr sport:", currSport);
          var sportData = _.find(d3.values(entriesBySportThenCountryThenYear), function(item) {
            // console.log("searching for ", currSport);
            // console.log("considering ", item.key);
            return item.key === currSport;
          });
          console.log(sportData);
          var countryData = _.find(d3.values(sportData.values), function(item) {
            // console.log("searching for ", d.key);
            // console.log("considering ", item.key);
            return item.key === d.key;
          });
          console.log(countryData);
          generateMedalChart(countryData.values, medalsvg);
        });


    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(this.xScale).ticks(5);
    var yAxis = d3.axisLeft(this.yScale).ticks(5);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${this.height - this.margin})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Total values");

    this.redraw(bigsvg, data);
  }


  redraw(bigsvg, data, currSport) {
    let lines = d3.select('.lines');
    lines.selectAll('.line-group')
    .transition()
    .style('opacity',0)
    .remove();

    console.log(data);

    var duration = 250;
    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
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
    console.log(svg);
    this.lines.selectAll('.line-group')
      .transition()
      .style('opacity', 0)
      .remove();


    this.lines.selectAll("line")
      .transition()
      .style('opacity', 0)
      .remove();

    this.lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', 'line')
      .attr('d', d => this.line(d.values))
      // Draw color based on index? Or maybe based on country?
      .style('stroke', (d, i) => color(d.key))
      .style('opacity', lineOpacity)
      .on("mouseover", function (d) {
        // change line opacity
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style('stroke-width', lineStrokeHover);
        // add text to show what country this is
        svg.append("text")
          .text(d.key)
          .attr('class', 'country-text')
          .attr("x", (width-margin)/2)
          .attr("y", 30)
          .style('fill', color(d.key))
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .style('opacity', lineOpacity)
          .style("stroke-width", lineStroke);
        svg.select(".country-text").remove();
      });
  }

}

module.exports = bigChart;
