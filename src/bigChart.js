// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');
const _ = require("underscore");

const generateMedalChart = require("./medalChart");

class bigChart {
  constructor() {

  }

  // dummy function used for debugging
  // drawChart(bigsvg) {


  //   var dummyData = [
  //     {
  //       name: "USA",
  //       values: [
  //         {date: "2000", price: "100"},
  //         {date: "2001", price: "110"},
  //         {date: "2002", price: "145"},
  //         {date: "2003", price: "241"},
  //         {date: "2004", price: "101"},
  //         {date: "2005", price: "90"},
  //         {date: "2006", price: "10"},
  //         {date: "2007", price: "35"},
  //         {date: "2008", price: "21"},
  //         {date: "2009", price: "201"}
  //       ]
  //     },
  //     {
  //       name: "Canada",
  //       values: [
  //         {date: "2000", price: "200"},
  //         {date: "2001", price: "120"},
  //         {date: "2002", price: "33"},
  //         {date: "2003", price: "21"},
  //         {date: "2004", price: "51"},
  //         {date: "2005", price: "190"},
  //         {date: "2006", price: "120"},
  //         {date: "2007", price: "85"},
  //         {date: "2008", price: "221"},
  //         {date: "2009", price: "101"}
  //       ]
  //     },
  //     {
  //       name: "Mexico",
  //       values: [
  //         {date: "2000", price: "50"},
  //         {date: "2001", price: "10"},
  //         {date: "2002", price: "5"},
  //         {date: "2003", price: "71"},
  //         {date: "2004", price: "20"},
  //         {date: "2005", price: "9"},
  //         {date: "2006", price: "220"},
  //         {date: "2007", price: "235"},
  //         {date: "2008", price: "61"},
  //         {date: "2009", price: "10"}
  //       ]
  //     }
  //   ];


  //   var parseDate = d3.timeParse("%Y");
  //   dummyData.forEach(function(d) {
  //     d.values.forEach(function(d) {
  //       d.date = parseDate(d.date);
  //       d.price = +d.price;
  //     });
  //   });
  //   this.drawChart(bigsvg, data);
  // }

  drawChart(bigsvg, data, currSport, medalsvg) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    // Set the width and height of the graph
    var width = parseInt(bigsvg.style("width"), 10);
    var height = parseInt(bigsvg.style("height"), 10);
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;



    console.log("+++++++++++++++++++++++++");
    console.log(data);
    console.log("+++++++++++++++++++++++++");
    // var width = 500;
    // var height = 300;
    var margin = 50;
    var duration = 250;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;


    // /* Format Data */
    // var parseDate = d3.timeParse("%Y");
    // data.forEach(function(d) {
    //   d.values.forEach(function(d) {
    //     d.date = parseDate(d.date);
    //     d.price = +d.price;
    //   });
    // });


    /* Scale */
    var xScale = d3.scaleTime()
      .domain([1980, 2016])
      .range([0, width-margin]);

    var yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([height-margin, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // delete all lines


    /* Add SVG */
    var svg = bigsvg.append("svg")
      .attr("width", (width+margin)+"px")
      .attr("height", (height+margin)+"px")
      .append('g')
      .attr("transform", `translate(${margin}, ${margin})`);

    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(d.key))
      .y(d => yScale(d.value));

    let lines = svg.append('g')
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
    var xAxis = d3.axisBottom(xScale).tickValues([1980, 1984,
      1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016])
      .tickFormat(d3.format("Y"));
    var yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Total values");
  }


  redraw(bigsvg, data, currSport) {
    let lines = d3.select('.lines');
    lines.selectAll('.line-group')
    .transition()
    .style('opacity',0)
    .remove();
  }

}

module.exports = bigChart;
