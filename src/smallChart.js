// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');

class smallChart {

  constructor() {
  }

  // Draw the top rank elements onto the small chart
  // given the current topRanks
  drawTopRanks(smallsvg, topRanks) {
    // draw a rectangle element for each result
    for (var i = 0; i < topRanks.length; i++) {
      // g will contain all of the components in this rank rectangle element
      var g = smallsvg.append("g");
      g.append("rect")
          .attr("x", 0)
          .attr("y", 110 * (i+1))
          .attr("width", 900)
          .attr("height", 100)
          .style("fill", "White");
      g.append("text")
          .attr("x", 400)
          .attr("y", 30 + 110 * (i+1))
          .style("fill", "Black")
          .text("Look it's result " + topRanks[i]);
      }
  }
}

module.exports = smallChart;
