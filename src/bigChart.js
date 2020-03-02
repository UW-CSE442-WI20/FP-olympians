

// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');

class bigChart {
  constructor() {


    // Formatting lines


    // getting width and height of graph
    this.width;
    this.height;
    this.margin = 50;

    // getting scale of graph

    // getting color sceme
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    // getting lineScale
    this.line;
    // getting the area where lines are added
    this.lines;


    // the svg containing the whole chart
    this.svg;
  }

  drawChart(bigsvg, data) {


    // Set the width and height of the graph
    var margin = { top: 30, right: 10, bottom: 10, left: 10 }
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

    xScale = d3.scaleLinear()
      .domain([1980, 2016])
      .range([0, this.width - margin.left - margin.right - 30]);

    yScale = d3.scaleLinear()
      .domain([0, 80])
      .range([0, this.height - margin.top - margin.bottom]);


    // delete all lines


    /* Add SVG */
    svg = bigsvg
      .append("svg")
      .attr("width", this.width + margin.left + margin.right)
      .attr("height", this.height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.top + "," + margin.top + ")"); // this is just (30, 30 right now)


    /* Add line into SVG */
    this.line = d3.line()
      .x(d => xScale(d.key))
      .y(d => yScale(d.value));

    this.lines = svg.append('g')
      .attr('class', 'lines');


    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", `translate(0, ${this.height - this.margin})`)
    //   .call(xAxis);

    dimensions = []
    for (i = 1980; i <= 2016; i += 4) {
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
      .style("fill", "black")


    // svg.append("g")
    //   .attr("class", "y axis")
    //   .call(yAxis)
    //   .append('text')
    //   .attr("y", 15)
    //   .attr("transform", "rotate(-90)")
    //   .attr("fill", "#000")
    //   .text("Total values");

    // svg.append("g")
    //   .data(dimensions).enter()
    //   // .attr("class", "brush")
    // .each(function(d) {
    //   console.log("xxxxxxxxxxxxxxxxx")
    //   console.log(d);
    //   // xScale(d), 0], [xScale(d) + 5, this.height
    //   d3.select(this).call(d3.brush().extent([0, 0], [100, 200]))})
    // .on("brushstart", this.brushstart).on("brush", brush));})
    // .selectAll("rect")
    //   .attr("x", -8)
    //   .attr("width", 16);

    svg.selectAll(".axisBrush")
      .data(dimensions).enter()
      .append("g")
      .attr('class', 'axisBrush')
      .each(function (d) {
        // console.log("xxxxxxxxxxxxxxxxx")
        // console.log(d);
        // xScale(d), 0], [xScale(d) + 5, this.height
        // d3.brushY().extent([0, 0], [100, 200])
        d3.select(this).call(d3.brushY().extent([[xScale(d), 0], [xScale(d) + 16 , yScale(80)]])) //TODO: change 600 to be this.height
      })

      // .attr("width", 16)
      // .attr("height", 10);
    // .on("brushstart", this.brushstart).on("brush", brush));})
    // .call(d3.brushY()                     // Add the brush feature using the d3.brush function
    //   .extent([[0, 0], [400, 400]])

    this.redraw(bigsvg, data);
  }


  brushstart() {
    d3.event.sourceEvent.stopPropogation();
  }

  brush() {

  }



  redraw(bigsvg, data) {

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
          .attr("x", (width - margin) / 2)
          .attr("y", 15)
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
