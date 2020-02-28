// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');

class smallChart {

  constructor() {
  }

  // Draw the top rank elements onto the small chart
  // given the current topRanks
  // topranks is the array with the ids of top ranked groups in data
  // where id is one of the identifying features in the data object
  // data is the dataset
  drawTopRanks(smallchartdiv, topRanks, data) {
    console.log(data.length)
    // draw a rectangle element for each result
    for (var i = 0; i < topRanks.length; i++) {
      // create the svg for country row
      var smallsvg = smallchartdiv 
        .append('svg')
        .attr('width', 1200)
        .attr('height', 460)
        .attr("fill", "Black");
      // we will create 1 g for each small multiple graph
      var g = smallsvg.append("g");
      g.append("text")
          .attr("x", 0)
          .attr("y", 30 + 110)
          .style("fill", "Black")
          .text(data[i].Name);
      g.append("rect")
          .attr("x", 300)
          .attr("width", 300)
          .attr("height", 300)
          .style("fill", "White");
      g.append("rect")
          .attr("x", 600)
          .attr("width", 300)
          .attr("height", 300)
          .style("fill", "Green");
      g.append("rect")
          .attr("x", 900)
          .attr("width", 300)
          .attr("height", 300)
          .style("fill", "Blue");
      }
  }
}

module.exports = smallChart;
